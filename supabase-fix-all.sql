-- Fix geral para alinhar o Supabase com o frontend atual
-- Rode este script no SQL Editor do Supabase (projeto correto)

-- Extensoes uteis
create extension if not exists pgcrypto;

-- =====================================================================
-- 1) Tabela bonus (estava faltando e gerando 404 no /rest/v1/bonus)
-- =====================================================================
create table if not exists public.bonus (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  "pageLink" text,
  videos jsonb not null default '[]'::jsonb,
  "is18Plus" boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.bonus enable row level security;

drop policy if exists "Membros podem ver bônus" on public.bonus;
create policy "Membros podem ver bônus"
on public.bonus for select
to public
using (true);

drop policy if exists "Admins controlam bônus" on public.bonus;
create policy "Admins controlam bônus"
on public.bonus for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- =====================================================================
-- 2) Tabela app_settings (config global + logos)
-- =====================================================================
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

insert into public.app_settings (
  id, title, support_email, accent_color, registration_open, logo_url, logo_18_url, logo_height
)
values (1, 'SaaS GATHO', 'ajuda@exemplo.com.br', '#C026D3', true, '', '', 32)
on conflict (id) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists "Public can read app settings" on public.app_settings;
create policy "Public can read app settings"
on public.app_settings for select
to public
using (true);

drop policy if exists "Admins can write app settings" on public.app_settings;
create policy "Admins can write app settings"
on public.app_settings for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- =====================================================================
-- 3) Alinhar tabela courses com o que o frontend usa
-- =====================================================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instructor text,
  description text,
  price text,
  old_price text,
  image_url text,
  affiliate_url text,
  plans jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.courses
  add column if not exists plans jsonb not null default '[]'::jsonb;

alter table public.courses
  add column if not exists old_price text;

alter table public.courses
  add column if not exists price text;

alter table public.courses
  add column if not exists affiliate_url text;

alter table public.courses
  add column if not exists image_url text;

alter table public.courses enable row level security;

drop policy if exists "Membros podem ver cursos" on public.courses;
create policy "Membros podem ver cursos"
on public.courses for select
to public
using (true);

drop policy if exists "Admins controlam cursos" on public.courses;
create policy "Admins controlam cursos"
on public.courses for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- =====================================================================
-- 4) Storage bucket branding (logos) + politicas
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read branding" on storage.objects;
create policy "Public can read branding"
on storage.objects for select
to public
using (bucket_id = 'branding');

drop policy if exists "Admins can upload branding" on storage.objects;
create policy "Admins can upload branding"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'branding'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update branding" on storage.objects;
create policy "Admins can update branding"
on storage.objects for update
to authenticated
using (
  bucket_id = 'branding'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'branding'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can delete branding" on storage.objects;
create policy "Admins can delete branding"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'branding'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- =====================================================================
-- 5) Verificacoes finais (resultado visual)
-- =====================================================================
select 'app_settings' as item, count(*)::text as total from public.app_settings
union all
select 'bonus', count(*)::text from public.bonus
union all
select 'courses', count(*)::text from public.courses;
