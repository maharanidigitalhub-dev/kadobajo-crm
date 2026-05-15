-- Run this in your Supabase SQL Editor to create the customers table

create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null default '',
  phone       text not null unique,
  status      text not null default 'new'
                check (status in ('new','contacted','negotiation','deal','lost')),
  source      text not null default 'landing_page',
  tag         text,
  notes       text,
  value       integer,
  created_at  timestamptz not null default now()
);

-- Index for fast phone lookups (duplicate prevention)
create index if not exists customers_phone_idx on public.customers (phone);

-- Index for status filtering
create index if not exists customers_status_idx on public.customers (status);

-- Enable Row Level Security
alter table public.customers enable row level security;

-- Allow anonymous reads and inserts (landing page lead capture + CRM reads via anon key)
create policy "Allow anon read" on public.customers
  for select using (true);

create policy "Allow anon insert" on public.customers
  for insert with check (true);

create policy "Allow anon update" on public.customers
  for update using (true);

-- Landing page tracking columns
alter table public.customers add column if not exists source_slug text;
alter table public.customers add column if not exists audience_segment text;
alter table public.customers add column if not exists landing_url text;
create index if not exists customers_source_slug_idx on public.customers (source_slug);

-- Reusable CMS landing pages
create table if not exists public.landing_pages (
  slug text primary key,
  audience text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft','live')),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.landing_pages enable row level security;

create policy "Allow anon read landing_pages" on public.landing_pages
  for select using (true);

create policy "Allow anon insert landing_pages" on public.landing_pages
  for insert with check (true);

create policy "Allow anon update landing_pages" on public.landing_pages
  for update using (true);
