create table if not exists public.app_settings (
  id integer primary key,
  title text not null,
  support_email text,
  accent_color text,
  registration_open boolean not null default true,
  logo_url text,
  logo_18_url text,
  logo_height integer not null default 32,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

insert into public.app_settings (id, title, support_email, accent_color, registration_open, logo_url, logo_18_url, logo_height)
values (1, 'SaaS GATHO', 'ajuda@exemplo.com.br', '#C026D3', true, '', '', 32)
on conflict (id) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists "Public can read app settings" on public.app_settings;
create policy "Public can read app settings"
on public.app_settings
for select
to public
using (true);

drop policy if exists "Admins can write app settings" on public.app_settings;
create policy "Admins can write app settings"
on public.app_settings
for all
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read branding" on storage.objects;
create policy "Public can read branding"
on storage.objects
for select
to public
using (bucket_id = 'branding');

drop policy if exists "Admins can upload branding" on storage.objects;
create policy "Admins can upload branding"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'branding'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update branding" on storage.objects;
create policy "Admins can update branding"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'branding'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'branding'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete branding" on storage.objects;
create policy "Admins can delete branding"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'branding'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
