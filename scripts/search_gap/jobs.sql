-- Search-to-article only. Private job identity, leases and immutable recovery receipts.
create table public.search_gap_jobs (
 site text not null, run_id text not null, packet_text text not null,
 packet_sha256 text not null, status text not null default 'active' check(status in ('active','complete')),
 owner text not null, lease_until timestamptz not null,
 checkpoints jsonb not null default '[]', created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(), primary key(site,run_id)
);
create unique index search_gap_one_active_job on public.search_gap_jobs(site) where status='active';
alter table public.search_gap_jobs enable row level security;
revoke all on public.search_gap_jobs from public,anon,authenticated;
grant select,insert,update on public.search_gap_jobs to service_role;

create function public.search_gap_job_claim(p_site text,p_owner text,p_packet text,p_adopt boolean default false)
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
  if (not p_adopt and exists((select q.event_id from public.search_gap_queue q where q.site=p_site and q.resolved_at is null) except (select e::uuid from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e)))
   or exists((select e::uuid from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e) except (select q.event_id from public.search_gap_queue q where q.site=p_site and (q.resolved_at is null or (p_adopt and q.resolution->>'runId'=p->>'runId')))) then
    return jsonb_build_object('status','refresh');
  end if;
  if (select count(*) from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e) <> (select count(distinct e) from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e) then raise exception 'Duplicate intake event'; end if;
  if p_adopt and not exists(select 1 from public.search_gap_queue q where q.site=p_site and q.resolved_at is null and q.event_id in(select e::uuid from jsonb_array_elements(p->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e)) then return jsonb_build_object('status','already-complete'); end if;
  if jsonb_array_length(p->'candidates')=0 then return jsonb_build_object('status','empty'); end if;
  insert into public.search_gap_jobs(site,run_id,packet_text,packet_sha256,owner,lease_until)
   values(p_site,p->>'runId',p_packet,encode(extensions.digest(convert_to(p_packet,'UTF8'),'sha256'),'hex'),p_owner,now()+interval '6 hours') returning * into j;
 end if;
 return jsonb_build_object('status','claimed','packetText',j.packet_text,'packetSha256',j.packet_sha256,'checkpoints',j.checkpoints,'leaseUntil',j.lease_until);
end $$;

create function public.search_gap_job_checkpoint(p_site text,p_run text,p_owner text,p_checkpoint jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; previous jsonb; k text; v jsonb;
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.status<>'active' or j.owner<>p_owner or j.lease_until<=now() then raise exception 'Job lease lost'; end if;
 previous:=coalesce(j.checkpoints->(jsonb_array_length(j.checkpoints)-1),'{}'::jsonb);
 for k,v in select * from jsonb_each(coalesce(previous->'canonicalJobs','{}')) loop
  if p_checkpoint->'canonicalJobs'->k is distinct from v then raise exception 'Canonical job identity cannot change'; end if;
 end loop;
 for k,v in select * from jsonb_each(coalesce(previous->'reviewCounters','{}')) loop
  if not coalesce((p_checkpoint->'reviewCounters'->>k)::numeric >= (v#>>'{}')::numeric,false) then raise exception 'Review counter cannot decrease'; end if;
 end loop;
 update public.search_gap_jobs set checkpoints=checkpoints||jsonb_build_array(p_checkpoint||jsonb_build_object('recordedAt',now())),lease_until=now()+interval '6 hours',updated_at=now() where site=p_site and run_id=p_run;
 return jsonb_build_object('ok',true);
end $$;

create function public.search_gap_job_ack(p_site text,p_run text,p_owner text,p_decision jsonb,p_receipt jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; ids uuid[];
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.status<>'active' or j.owner<>p_owner or j.lease_until<=now() then raise exception 'Job lease lost'; end if;
 if p_decision->>'status' not in ('published','no-addition','dropped') or p_receipt->'decision' is distinct from p_decision or p_receipt->>'runId'<>p_run then raise exception 'Invalid acknowledgment'; end if;
 select array_agg(e::uuid) into ids from jsonb_array_elements(j.packet_text::jsonb->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e where c->>'id'=p_decision->>'id';
 if ids is null then raise exception 'Unknown intake candidate'; end if;
 update public.search_gap_queue set resolution=p_receipt,resolved_at=now() where site=p_site and event_id=any(ids) and resolved_at is null;
 return jsonb_build_object('ok',true);
end $$;

create function public.search_gap_job_close(p_site text,p_run text,p_owner text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare j public.search_gap_jobs; n bigint;
begin
 select * into j from public.search_gap_jobs where site=p_site and run_id=p_run for update;
 if not found or j.owner<>p_owner then raise exception 'Job lease lost'; end if;
 select count(*) into n from public.search_gap_queue q where q.site=p_site and q.resolved_at is null and q.event_id in(select e::uuid from jsonb_array_elements(j.packet_text::jsonb->'candidates') c cross join lateral jsonb_array_elements_text(c->'eventIds') e);
 if n=0 then update public.search_gap_jobs set status='complete',updated_at=now() where site=p_site and run_id=p_run; end if;
 return jsonb_build_object('complete',n=0,'pendingEvents',n);
end $$;
revoke all on function public.search_gap_job_claim(text,text,text,boolean),public.search_gap_job_checkpoint(text,text,text,jsonb),public.search_gap_job_ack(text,text,text,jsonb,jsonb),public.search_gap_job_close(text,text,text) from public,anon,authenticated;
grant execute on function public.search_gap_job_claim(text,text,text,boolean),public.search_gap_job_checkpoint(text,text,text,jsonb),public.search_gap_job_ack(text,text,text,jsonb,jsonb),public.search_gap_job_close(text,text,text) to service_role;
notify pgrst,'reload schema';
