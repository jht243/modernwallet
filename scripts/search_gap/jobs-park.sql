-- Search-to-article only. Owner-authorized 2026-11-13: a job whose remaining candidates can
-- never finish (independently reviewed holds, or published work whose review evidence is
-- provably lost) is PARKED instead of blocking every later search forever.
-- Parked observations stay unresolved (resolved_at is null): they are never reported as
-- published, dropped or no-addition. They carry an honest `resolution.parked` record and are
-- excluded from new intakes. New occurrences of the same term are new events and stay pending.
-- Sites without parked rows behave exactly as before. Idempotent.
begin;
do $$ declare c record; begin
 for c in select conname from pg_constraint where conrelid='public.search_gap_jobs'::regclass and contype='c' and pg_get_constraintdef(oid) like '%status%' loop
  execute format('alter table public.search_gap_jobs drop constraint %I', c.conname);
 end loop;
end $$;
alter table public.search_gap_jobs add constraint search_gap_jobs_status_check check(status in ('active','complete','parked','owner-closed'));
alter table public.search_gap_jobs add column if not exists parked jsonb;

create or replace function public.search_gap_job_claim(p_site text,p_owner text,p_packet text,p_adopt boolean default false)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; p jsonb:=p_packet::jsonb;
begin
 if length(p_owner)<16 or p->>'site'<>p_site then raise exception 'Invalid job identity'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('search-gap:'||p_site,0));
 select * into j from public.search_gap_jobs where site=p_site and status='active' for update;
 if found then
  if j.owner<>p_owner and j.lease_until>now() then return jsonb_build_object('status','busy','runId',j.run_id,'leaseUntil',j.lease_until); end if;
  update public.search_gap_jobs set owner=p_owner,lease_until=now()+interval '6 hours',updated_at=now() where site=p_site and run_id=j.run_id returning * into j;
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

create or replace function public.search_gap_job_park(p_site text,p_run text,p_owner text,p_receipt jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; blocked jsonb; c jsonb; n bigint; parked_ids text[];
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.status<>'active' or j.owner<>p_owner or j.lease_until<=now() then raise exception 'Job lease lost'; end if;
 if j.created_at>now()-interval '48 hours' then raise exception 'Only a job older than 48 hours can be parked'; end if;
 if p_receipt->>'runId' is distinct from p_run or jsonb_typeof(p_receipt->'blocked')<>'array' or jsonb_array_length(p_receipt->'blocked')=0 then raise exception 'Invalid park receipt'; end if;
 if exists(select 1 from jsonb_array_elements(p_receipt->'blocked') b where b->>'kind' not in ('verified-hold','published-evidence-lost') or b->'decision'->>'id' is distinct from b->>'id') then raise exception 'Invalid parked candidate kind'; end if;
 select array_agg(b->>'id') into parked_ids from jsonb_array_elements(p_receipt->'blocked') b;
 if cardinality(parked_ids)<>(select count(distinct x) from unnest(parked_ids) x) then raise exception 'Duplicate parked candidate'; end if;
 if exists(select 1 from unnest(parked_ids) i where i is null or not exists(select 1 from jsonb_array_elements(j.packet_text::jsonb->'candidates') x where x->>'id'=i)) then raise exception 'Unknown parked candidate'; end if;
 -- Every still-unresolved observation of this job must belong to a parked candidate:
 -- settled decisions are acknowledged through search_gap_job_ack first.
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
revoke all on function public.search_gap_job_park(text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.search_gap_job_park(text,text,text,jsonb) to service_role;
commit;
notify pgrst,'reload schema';
