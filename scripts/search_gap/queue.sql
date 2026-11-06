-- Search-gap only. No changes to search logging, mindmap or other routines.
create table public.search_gap_queue (
  site text not null,
  event_id uuid not null,
  payload jsonb not null,
  resolution jsonb,
  resolved_at timestamptz,
  primary key (site,event_id)
);
alter table public.search_gap_queue enable row level security;
revoke all on public.search_gap_queue from public, anon, authenticated;
grant select, insert, update on public.search_gap_queue to service_role;
create index search_gap_queue_pending on public.search_gap_queue(site) where resolved_at is null;

create function public.search_gap_harvest(p_site text)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare n bigint;
begin
  insert into public.search_gap_queue(site,event_id,payload)
  select site,id,to_jsonb(q) from public.search_queries q
  where site=p_site and created_at >= '2026-11-01T00:00:00Z'
    and (results_count=0 or source='chatbot') and length(trim(term))>0
  on conflict do nothing;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.search_gap_harvest(text) from public,anon,authenticated;
grant execute on function public.search_gap_harvest(text) to service_role;
notify pgrst, 'reload schema';
