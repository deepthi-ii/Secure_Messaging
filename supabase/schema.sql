-- Demo-only schema for storing security event metadata. Do not store private keys or plaintext messages here.
create table if not exists public.security_events (
  id bigint generated always as identity primary key,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.security_events enable row level security;
-- Prototype policies: anonymous browser demo may insert and read event logs.
-- For production, replace with authenticated user policies and restrict event fields.
create policy "demo insert security events" on public.security_events
  for insert to anon, authenticated with check (true);
create policy "demo read security events" on public.security_events
  for select to anon, authenticated using (true);
