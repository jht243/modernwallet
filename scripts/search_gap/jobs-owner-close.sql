-- Search-to-article only. Owner-authorized 2026-11-13 close-out of an old job (> 48 hours).
-- Authorization lives HERE, not in repository files: only the owner inserts rows into
-- search_gap_owner_requests (site, run_id, exact sha256 of the committed request). Candidates
-- published as written are acknowledged first (search_gap_job_ack, status published); restart
-- candidates stay unresolved and unparked, so the next intake writes them fresh in a new job.
-- Requires jobs-park.sql. Idempotent.
begin;
create table if not exists public.search_gap_owner_requests (
 site text not null, run_id text not null, request_sha256 text not null check (request_sha256 ~ '^[0-9a-f]{64}$'),
 note text, created_at timestamptz not null default now(), primary key(site,run_id)
);
alter table public.search_gap_owner_requests enable row level security;
-- Routines hold the service_role key: it may READ authorizations, never write them.
revoke all on public.search_gap_owner_requests from public,anon,authenticated,service_role;
grant select on public.search_gap_owner_requests to service_role;
do $$ begin
 if has_table_privilege('service_role','public.search_gap_owner_requests','INSERT') or has_table_privilege('service_role','public.search_gap_owner_requests','UPDATE')
  or has_table_privilege('service_role','public.search_gap_owner_requests','DELETE') or has_table_privilege('service_role','public.search_gap_owner_requests','TRUNCATE')
  or has_table_privilege('anon','public.search_gap_owner_requests','SELECT') or has_table_privilege('authenticated','public.search_gap_owner_requests','SELECT') then
  raise exception 'Owner authorization table must not be writable by routines';
 end if;
end $$;

do $$ declare c record; begin
 for c in select conname from pg_constraint where conrelid='public.search_gap_jobs'::regclass and contype='c' and pg_get_constraintdef(oid) like '%status%' loop
  execute format('alter table public.search_gap_jobs drop constraint %I', c.conname);
 end loop;
end $$;
alter table public.search_gap_jobs add constraint search_gap_jobs_status_check check(status in ('active','complete','parked','owner-closed'));

create or replace function public.search_gap_job_owner_close(p_site text,p_run text,p_owner text,p_receipt jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; restart_ids text[]; done_ids text[]; all_ids text[]; n bigint;
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.status<>'active' or j.owner<>p_owner or j.lease_until<=now() then raise exception 'Job lease lost'; end if;
 if j.created_at>now()-interval '48 hours' then raise exception 'Only a job older than 48 hours can be closed out'; end if;
 if not exists(select 1 from public.search_gap_owner_requests r where r.site=p_site and r.run_id=p_run and r.request_sha256=p_receipt->>'requestSha256') then raise exception 'No owner authorization for this request'; end if;
 if p_receipt->>'runId' is distinct from p_run or jsonb_typeof(p_receipt->'restart')<>'array' or jsonb_typeof(p_receipt->'published')<>'object' or jsonb_typeof(p_receipt->'settled')<>'array' then raise exception 'Invalid owner close-out receipt'; end if;
 select coalesce(array_agg(x),'{}') into restart_ids from jsonb_array_elements_text(p_receipt->'restart') x;
 select coalesce(array_agg(x),'{}') into done_ids from (select jsonb_object_keys(p_receipt->'published') x union all select jsonb_array_elements_text(p_receipt->'settled')) s;
 select coalesce(array_agg(c->>'id'),'{}') into all_ids from jsonb_array_elements(j.packet_text::jsonb->'candidates') c;
 if cardinality(restart_ids)+cardinality(done_ids)<>cardinality(all_ids)
  or (select count(distinct x) from unnest(restart_ids||done_ids) x)<>cardinality(all_ids)
  or exists(select 1 from unnest(restart_ids||done_ids) x where not (x=any(all_ids))) then raise exception 'Receipt must account for every candidate exactly once'; end if;
 select count(*) into n from public.search_gap_queue q where q.site=p_site and q.resolved_at is null
  and q.event_id in(select e::uuid from jsonb_array_elements(j.packet_text::jsonb->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e where c->>'id'=any(done_ids));
 if n>0 then raise exception 'Published or settled candidates are not acknowledged: %', n; end if;
 update public.search_gap_jobs set status='owner-closed',parked=p_receipt||jsonb_build_object('kind','owner-close','ownerClosedAt',now()),updated_at=now() where site=p_site and run_id=p_run;
 return jsonb_build_object('ok',true,'restarted',cardinality(restart_ids));
end $$;
revoke all on function public.search_gap_job_owner_close(text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.search_gap_job_owner_close(text,text,text,jsonb) to service_role;
commit;
notify pgrst,'reload schema';
