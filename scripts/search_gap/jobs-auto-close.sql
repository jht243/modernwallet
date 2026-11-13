-- Search-to-article only. Owner rule 2026-11-13: "anything stuck is fixed right away".
-- 1. No waiting period: park and owner close-out work on a job of any age.
-- 2. Standing owner authorization per site (search_gap_owner_policy, owner-written only): a routine
--    that cannot finish its job closes it in the same invocation (auto close-out): reviewed drafts
--    already written are published, everything else restarts once, and a search that already
--    failed a fresh retry is closed as dropped with an honest reason (no endless loops).
-- 3. A dead run cannot hold a site for hours: a new-worker lease with no heartbeat for 3 hours may be
--    taken over by the next invocation (old-worker leases unchanged).
-- Requires jobs-park.sql and jobs-owner-close.sql. Idempotent.
begin;
create table if not exists public.search_gap_owner_policy (
 site text primary key, auto_close boolean not null default false, note text, created_at timestamptz not null default now()
);
alter table public.search_gap_owner_policy enable row level security;
revoke all on public.search_gap_owner_policy from public,anon,authenticated,service_role;
grant select on public.search_gap_owner_policy to service_role;
do $$ begin
 if has_table_privilege('service_role','public.search_gap_owner_policy','INSERT') or has_table_privilege('service_role','public.search_gap_owner_policy','UPDATE')
  or has_table_privilege('service_role','public.search_gap_owner_policy','DELETE') or has_table_privilege('service_role','public.search_gap_owner_policy','TRUNCATE')
  or has_table_privilege('anon','public.search_gap_owner_policy','SELECT') or has_table_privilege('authenticated','public.search_gap_owner_policy','SELECT') then
  raise exception 'Owner policy table must not be writable by routines';
 end if;
end $$;

-- Heartbeat: only jobs whose owner runs the new worker (it heartbeats) get dead-run takeover;
-- old-worker sites keep the plain lease rule, unchanged.
alter table public.search_gap_jobs add column if not exists heartbeat_at timestamptz;
create or replace function public.search_gap_job_heartbeat(p_site text,p_run text,p_owner text)
returns jsonb language plpgsql security invoker set search_path='' as $$
begin
 update public.search_gap_jobs set heartbeat_at=now(),lease_until=greatest(lease_until,now()+interval '6 hours')
  where site=p_site and run_id=p_run and owner=p_owner and status='active' and lease_until>now();
 if not found then raise exception 'Job lease lost'; end if;
 return jsonb_build_object('ok',true);
end $$;
revoke all on function public.search_gap_job_heartbeat(text,text,text) from public,anon,authenticated;
grant execute on function public.search_gap_job_heartbeat(text,text,text) to service_role;

create or replace function public.search_gap_job_claim(p_site text,p_owner text,p_packet text,p_adopt boolean default false)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; p jsonb:=p_packet::jsonb;
begin
 if length(p_owner)<16 or p->>'site'<>p_site then raise exception 'Invalid job identity'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('search-gap:'||p_site,0));
 select * into j from public.search_gap_jobs where site=p_site and status='active' for update;
 if found then
  -- New-worker owners heartbeat; 3 silent hours after a heartbeat means a dead run. Owners that never
  -- heartbeat (old worker) keep the plain lease rule.
  if j.owner<>p_owner and j.lease_until>now() and (j.heartbeat_at is null or j.heartbeat_at>now()-interval '3 hours') then return jsonb_build_object('status','busy','runId',j.run_id,'leaseUntil',j.lease_until); end if;
  update public.search_gap_jobs set owner=p_owner,lease_until=now()+interval '6 hours',updated_at=now(),heartbeat_at=case when j.owner=p_owner then j.heartbeat_at else null end where site=p_site and run_id=j.run_id returning * into j;
 else
  if (not p_adopt and exists((select q.event_id from public.search_gap_queue q where q.site=p_site and q.resolved_at is null and (q.resolution is null or not (q.resolution ? 'parked'))) except (select e::uuid from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e)))
   or exists((select e::uuid from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e) except (select q.event_id from public.search_gap_queue q where q.site=p_site and ((q.resolved_at is null and (q.resolution is null or not (q.resolution ? 'parked'))) or (p_adopt and q.resolution->>'runId'=p->>'runId')))) then
    return jsonb_build_object('status','refresh');
  end if;
  if (select count(*) from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e) <> (select count(distinct e) from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e) then raise exception 'Duplicate intake event'; end if;
  if p_adopt and not exists(select 1 from public.search_gap_queue q where q.site=p_site and q.resolved_at is null and q.event_id in(select e::uuid from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e)) then return jsonb_build_object('status','already-complete'); end if;
  if jsonb_array_length(p->'candidates')=0 then return jsonb_build_object('status','empty'); end if;
  insert into public.search_gap_jobs(site,run_id,packet_text,packet_sha256,owner,lease_until)
   values(p_site,p->>'runId',p_packet,encode(extensions.digest(convert_to(p_packet,'UTF8'),'sha256'),'hex'),p_owner,now()+interval '6 hours') returning * into j;
 end if;
 return jsonb_build_object('status','claimed','packetText',j.packet_text,'packetSha256',j.packet_sha256,'checkpoints',j.checkpoints,'leaseUntil',j.lease_until,'createdAt',j.created_at);
end $$;

create or replace function public.search_gap_job_owner_close(p_site text,p_run text,p_owner text,p_receipt jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; restart_ids text[]; done_ids text[]; all_ids text[]; n bigint;
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.status<>'active' or j.owner<>p_owner or j.lease_until<=now() then raise exception 'Job lease lost'; end if;
 if not (exists(select 1 from public.search_gap_owner_requests r where r.site=p_site and r.run_id=p_run and r.request_sha256=p_receipt->>'requestSha256')
         or ((p_receipt->>'autoClose')='true' and exists(select 1 from public.search_gap_owner_policy o where o.site=p_site and o.auto_close))) then
  raise exception 'No owner authorization for this close-out'; end if;
 if p_receipt->>'runId' is distinct from p_run or jsonb_typeof(p_receipt->'restart')<>'array' or jsonb_typeof(p_receipt->'published')<>'object'
  or jsonb_typeof(p_receipt->'settled')<>'array' or jsonb_typeof(coalesce(p_receipt->'dropped','[]'::jsonb))<>'array' then raise exception 'Invalid owner close-out receipt'; end if;
 select coalesce(array_agg(x),'{}') into restart_ids from jsonb_array_elements_text(p_receipt->'restart') x;
 select coalesce(array_agg(x),'{}') into done_ids from (select jsonb_object_keys(p_receipt->'published') x union all select jsonb_array_elements_text(p_receipt->'settled')
  union all select jsonb_array_elements_text(coalesce(p_receipt->'dropped','[]'::jsonb))) s;
 select coalesce(array_agg(c->>'id'),'{}') into all_ids from jsonb_array_elements(j.packet_text::jsonb->'candidates') c;
 if cardinality(restart_ids)+cardinality(done_ids)<>cardinality(all_ids)
  or (select count(distinct x) from unnest(restart_ids||done_ids) x)<>cardinality(all_ids)
  or exists(select 1 from unnest(restart_ids||done_ids) x where not (x=any(all_ids))) then raise exception 'Receipt must account for every candidate exactly once'; end if;
 select count(*) into n from public.search_gap_queue q where q.site=p_site and q.resolved_at is null
  and q.event_id in(select e::uuid from jsonb_array_elements(j.packet_text::jsonb->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e where c->>'id'=any(done_ids));
 if n>0 then raise exception 'Published, settled or dropped candidates are not acknowledged: %', n; end if;
 if exists(select 1 from public.search_gap_queue q where q.site=p_site and q.resolved_at is not null
  and q.event_id in(select e::uuid from jsonb_array_elements(j.packet_text::jsonb->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e where c->>'id'=any(restart_ids))) then
  raise exception 'Already-resolved candidates cannot be marked restart';
 end if;
 update public.search_gap_jobs set status='owner-closed',parked=p_receipt||jsonb_build_object('kind',case when (p_receipt->>'autoClose')='true' then 'auto-close' else 'owner-close' end,'ownerClosedAt',now()),updated_at=now() where site=p_site and run_id=p_run;
 return jsonb_build_object('ok',true,'restarted',cardinality(restart_ids));
end $$;

-- Park: same rules as jobs-park.sql, without the waiting period.
create or replace function public.search_gap_job_park(p_site text,p_run text,p_owner text,p_receipt jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; blocked jsonb; n bigint; parked_ids text[];
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.status<>'active' or j.owner<>p_owner or j.lease_until<=now() then raise exception 'Job lease lost'; end if;
 if p_receipt->>'runId' is distinct from p_run or jsonb_typeof(p_receipt->'blocked')<>'array' or jsonb_array_length(p_receipt->'blocked')=0 then raise exception 'Invalid park receipt'; end if;
 if exists(select 1 from jsonb_array_elements(p_receipt->'blocked') b where b->>'kind' not in ('verified-hold','published-evidence-lost') or b->'decision'->>'id' is distinct from b->>'id') then raise exception 'Invalid parked candidate kind'; end if;
 select array_agg(b->>'id') into parked_ids from jsonb_array_elements(p_receipt->'blocked') b;
 if cardinality(parked_ids)<>(select count(distinct x) from unnest(parked_ids) x) then raise exception 'Duplicate parked candidate'; end if;
 if exists(select 1 from unnest(parked_ids) i where i is null or not exists(select 1 from jsonb_array_elements(j.packet_text::jsonb->'candidates') x where x->>'id'=i)) then raise exception 'Unknown parked candidate'; end if;
 select count(*) into n from public.search_gap_queue q where q.site=p_site and q.resolved_at is null
  and q.event_id in(select e::uuid from jsonb_array_elements(j.packet_text::jsonb->'candidates') x cross join lateral jsonb_array_elements_text(x->'eventIds') e where not (x->>'id'=any(parked_ids)));
 if n>0 then raise exception 'Unacknowledged settled decisions remain: %', n; end if;
 for blocked in select * from jsonb_array_elements(p_receipt->'blocked') loop
  update public.search_gap_queue set resolution=jsonb_build_object('parked',blocked||jsonb_build_object('runId',p_run,'parkedAt',now()))
   where site=p_site and resolved_at is null and event_id in(select e::uuid from jsonb_array_elements(j.packet_text::jsonb->'candidates') x cross join lateral jsonb_array_elements_text(x->'eventIds') e where x->>'id'=blocked->>'id');
 end loop;
 update public.search_gap_jobs set status='parked',parked=p_receipt||jsonb_build_object('parkedAt',now()),updated_at=now() where site=p_site and run_id=p_run;
 return jsonb_build_object('ok',true,'parkedCandidates',jsonb_array_length(p_receipt->'blocked'));
end $$;
revoke all on function public.search_gap_job_owner_close(text,text,text,jsonb),public.search_gap_job_park(text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.search_gap_job_owner_close(text,text,text,jsonb),public.search_gap_job_park(text,text,text,jsonb) to service_role;
commit;
notify pgrst,'reload schema';
