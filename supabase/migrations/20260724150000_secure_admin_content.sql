begin;

alter table public.portofolio enable row level security;
alter table public.jurnal enable row level security;

-- Replace legacy table policies so anonymous visitors can only read content.
do $policy_cleanup$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('portofolio', 'jurnal')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end
$policy_cleanup$;

create policy "Public can read portfolio"
on public.portofolio
for select
to anon, authenticated
using (true);

create policy "Owner can insert portfolio"
on public.portofolio
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can update portfolio"
on public.portofolio
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can delete portfolio"
on public.portofolio
for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Public can read journals"
on public.jurnal
for select
to anon, authenticated
using (true);

create policy "Owner can insert journals"
on public.jurnal
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can update journals"
on public.jurnal
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can delete journals"
on public.jurnal
for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) =
  lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

-- Restrictive policies ensure an older broad storage policy cannot grant
-- anonymous writes to this bucket. Other buckets keep their existing rules.
drop policy if exists "Portfolio media inserts require owner" on storage.objects;
drop policy if exists "Portfolio media updates require owner" on storage.objects;
drop policy if exists "Portfolio media deletes require owner" on storage.objects;
drop policy if exists "Owner can upload portfolio media" on storage.objects;
drop policy if exists "Owner can update portfolio media" on storage.objects;
drop policy if exists "Owner can delete portfolio media" on storage.objects;

create policy "Portfolio media inserts require owner"
on storage.objects
as restrictive
for insert
to public
with check (
  bucket_id <> 'gambar-portofolio'
  or lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Portfolio media updates require owner"
on storage.objects
as restrictive
for update
to public
using (
  bucket_id <> 'gambar-portofolio'
  or lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
)
with check (
  bucket_id <> 'gambar-portofolio'
  or lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Portfolio media deletes require owner"
on storage.objects
as restrictive
for delete
to public
using (
  bucket_id <> 'gambar-portofolio'
  or lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gambar-portofolio'
  and lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can update portfolio media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gambar-portofolio'
  and lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
)
with check (
  bucket_id = 'gambar-portofolio'
  and lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

create policy "Owner can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gambar-portofolio'
  and lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('muhammadzakymubarok@student.telkomuniversity.ac.id')
);

commit;
