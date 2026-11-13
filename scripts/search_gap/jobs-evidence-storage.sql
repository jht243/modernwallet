-- Search-to-article only. Private storage bucket for run evidence between stages and runs.
-- Never public: only service_role (held by cloud routines) may read or write objects here;
-- anon and authenticated have zero policies on this bucket, keeping visitor text and drafts private.
-- Idempotent.
begin;
insert into storage.buckets (id, name, public, file_size_limit)
values ('search-gap-evidence', 'search-gap-evidence', false, 20971520)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit;
commit;
