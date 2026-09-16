-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New
-- query -> paste this whole file -> Run). Safe to re-run: every statement
-- is idempotent (`if not exists` / `create or replace`).
--
-- Covers all three phases (inquiries, estimate_sessions,
-- push_subscriptions) so this only needs to be run once, even though the
-- app code that uses each table ships in separate phases.

create extension if not exists pgcrypto;

-- Tables created via the SQL Editor (rather than the dashboard's "New
-- Table" UI) don't automatically get baseline object-level privileges for
-- the anon/authenticated roles — RLS policies only restrict rows for roles
-- that already have privilege on the table at all. Grant that explicitly.
grant usage on schema public to anon, authenticated;

-- ============================================================
-- Phase A: submitted quote requests (replaces Formspree)
-- ============================================================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  event_date date,
  event_type text,
  guest_count integer,
  rental_needed text,
  event_location text,
  details text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

alter table public.inquiries enable row level security;
grant select, insert, update on public.inquiries to anon, authenticated;

drop policy if exists "Anyone can submit an inquiry" on public.inquiries;
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert
  to anon
  with check (true);

drop policy if exists "Authenticated users can view inquiries" on public.inquiries;
create policy "Authenticated users can view inquiries"
  on public.inquiries for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can update inquiries" on public.inquiries;
create policy "Authenticated users can update inquiries"
  on public.inquiries for update
  to authenticated
  using (true);

-- ============================================================
-- Phase C: in-progress / abandoned estimate-chat sessions
-- ============================================================
create table if not exists public.estimate_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  event_type text,
  event_date date,
  guest_count integer,
  budget numeric,
  email text,
  cart_snapshot jsonb,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted'))
);

-- Columns added after the table's first release — safe no-ops if this is a
-- fresh install where the create table above already included them.
alter table public.estimate_sessions add column if not exists event_date date;
alter table public.estimate_sessions add column if not exists email text;

alter table public.estimate_sessions enable row level security;
grant select, insert, update on public.estimate_sessions to anon, authenticated;

-- Anon can create/update its own session by session_id (a random UUID
-- generated client-side — not guessable in practice). This is a
-- deliberately loose policy for a lead-capture MVP: anyone who somehow
-- knew another visitor's session_id could update that row could see/change
-- the email left on it, but a random UUID isn't practically guessable.
drop policy if exists "Anyone can create an estimate session" on public.estimate_sessions;
create policy "Anyone can create an estimate session"
  on public.estimate_sessions for insert
  to anon
  with check (true);

drop policy if exists "Anyone can update an estimate session" on public.estimate_sessions;
create policy "Anyone can update an estimate session"
  on public.estimate_sessions for update
  to anon
  using (true);

drop policy if exists "Authenticated users can view estimate sessions" on public.estimate_sessions;
create policy "Authenticated users can view estimate sessions"
  on public.estimate_sessions for select
  to authenticated
  using (true);

-- ============================================================
-- Phase D: push notification subscriptions for the admin PWA
-- ============================================================
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  admin_user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null
);

alter table public.push_subscriptions enable row level security;
grant select, insert, update, delete on public.push_subscriptions to authenticated;

-- Regular authenticated access is scoped to your own subscriptions. The
-- api/notify.js serverless function reads this table with the Supabase
-- service role key, which bypasses RLS entirely, so it can still notify
-- every registered device.
drop policy if exists "Admins manage their own push subscription" on public.push_subscriptions;
create policy "Admins manage their own push subscription"
  on public.push_subscriptions for all
  to authenticated
  using (auth.uid() = admin_user_id)
  with check (auth.uid() = admin_user_id);
