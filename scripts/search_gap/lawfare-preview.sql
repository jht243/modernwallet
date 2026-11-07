-- Search-only public-data/signing broker. No raw production credential is returned.
create function public.search_gap_lawfare_sign(p_title text,p_section text)
returns text language plpgsql security definer set search_path='' as $$
declare signing_key text;
begin
 if coalesce(current_setting('request.jwt.claims',true)::jsonb->>'role','')<>'service_role' then raise exception 'Service role required'; end if;
 if length(p_title)>500 or length(p_section)>150 or p_title is null or p_section is null then raise exception 'Invalid image parameters'; end if;
 select decrypted_secret into strict signing_key from vault.decrypted_secrets where name='search_gap_lawfare_og_key_v1';
 return substr(encode(extensions.hmac(convert_to(p_title||chr(31)||p_section,'UTF8'),convert_to(signing_key,'UTF8'),'sha256'),'hex'),1,20);
end $$;
create function public.search_gap_lawfare_fixture()
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if coalesce(current_setting('request.jwt.claims',true)::jsonb->>'role','')<>'service_role' then raise exception 'Service role required'; end if;
 return jsonb_build_object('capturedAt',now(),'site','lawfareclaims.org','tables',jsonb_build_object(
 'tracker_published_pages',(select coalesce(jsonb_agg(to_jsonb(p)-array['og_image_bytes','audit_json']),'[]') from lawfare.tracker_published_pages p where p.status='published'),
 'tracker_opportunities',(select coalesce(jsonb_agg(to_jsonb(o)-array['notes','score','review_status','seen','bill_data','publish_started_at']),'[]') from lawfare.tracker_opportunities o where exists(select 1 from lawfare.tracker_published_pages p where p.opportunity_id=o.id and p.status='published')),
 'blog_posts',(select coalesce(jsonb_agg(to_jsonb(b)-array['og_image_bytes','llm_model','llm_input_tokens','llm_output_tokens','llm_cost_usd']),'[]') from lawfare.blog_posts b where b.published_date<=current_date),
 'landing_pages','[]'::jsonb));
end $$;
revoke all on function public.search_gap_lawfare_sign(text,text),public.search_gap_lawfare_fixture() from public,anon,authenticated;
grant execute on function public.search_gap_lawfare_sign(text,text),public.search_gap_lawfare_fixture() to service_role;
notify pgrst,'reload schema';
