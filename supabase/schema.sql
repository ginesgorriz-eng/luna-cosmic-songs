-- Luna Kosmic Songs - Supabase Schema Migration
-- Created: 2026-04-13
-- Database schema for Luna Ki fan portal with user registration, game sessions, and admin config

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- TABLE: makinas (Registered users - extends auth.users)
-- ============================================================================
create table if not exists public.makinas (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  pronombre text not null,
  email text not null unique,
  telefono text not null,
  ciudad text not null,
  pais text not null default 'España',
  puntos_acumulados integer default 0 check (puntos_acumulados >= 0),
  puntos_gastados integer default 0 check (puntos_gastados >= 0),
  referrer_source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster lookups
create index idx_makinas_email on public.makinas(email);
create index idx_makinas_created_at on public.makinas(created_at desc);
create index idx_makinas_pais on public.makinas(pais);

-- ============================================================================
-- TRIGGER: Update updated_at timestamp on makinas
-- ============================================================================
create or replace function public.update_makinas_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger makinas_updated_at_trigger
  before update on public.makinas
  for each row
  execute function public.update_makinas_updated_at();

-- ============================================================================
-- TABLE: sesiones_juego (Game sessions for analytics)
-- ============================================================================
create table if not exists public.sesiones_juego (
  id uuid primary key default gen_random_uuid(),
  makina_id uuid references public.makinas(id) on delete set null,
  guest_fingerprint text,
  inicio timestamptz default now(),
  fin timestamptz,
  puntos_obtenidos integer default 0 check (puntos_obtenidos >= 0),
  nivel text not null check (nivel in ('basico', 'avanzado')),
  fases_completadas integer default 0 check (fases_completadas >= 0),
  canciones_completadas text[] default '{}',
  referrer_source text,
  user_agent text,
  created_at timestamptz default now()
);

-- Indexes for better query performance
create index idx_sesiones_juego_makina_id on public.sesiones_juego(makina_id);
create index idx_sesiones_juego_created_at on public.sesiones_juego(created_at desc);
create index idx_sesiones_juego_inicio on public.sesiones_juego(inicio desc);
create index idx_sesiones_juego_guest_fingerprint on public.sesiones_juego(guest_fingerprint);

-- ============================================================================
-- TABLE: admin_config (Admin panel configuration)
-- ============================================================================
create table if not exists public.admin_config (
  key text primary key,
  value text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- RLS POLICIES: makinas table
-- ============================================================================
alter table public.makinas enable row level security;

-- Policy: Users can read their own makina record
create policy "Users can view their own makina"
  on public.makinas for select
  using (auth.uid() = id);

-- Policy: Users can update their own makina record
create policy "Users can update their own makina"
  on public.makinas for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: Service role can do everything (for server-side operations)
-- Policy: Authenticated users can insert their own makina record (registration)
create policy "Users can insert their own makina"
  on public.makinas for insert
  with check (auth.uid() = id);

create policy "Service role can manage makinas"
  on public.makinas for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================================
-- RLS POLICIES: sesiones_juego table
-- ============================================================================
alter table public.sesiones_juego enable row level security;

-- Policy: Anyone can insert game sessions (for anonymous guests and registered users)
create policy "Anyone can create game sessions"
  on public.sesiones_juego for insert
  with check (true);

-- Policy: Users can read their own game sessions
create policy "Users can view their own sessions"
  on public.sesiones_juego for select
  using (
    auth.uid() = makina_id
    or (makina_id is null and guest_fingerprint is not null)
  );

-- Policy: Service role can read all sessions for analytics
create policy "Service role can read all sessions"
  on public.sesiones_juego for select
  using (auth.role() = 'service_role');

-- Policy: Service role can update sessions (e.g., set fin timestamp)
create policy "Service role can update sessions"
  on public.sesiones_juego for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================================
-- RLS POLICIES: admin_config table
-- ============================================================================
alter table public.admin_config enable row level security;

-- Policy: Only service role can manage admin config
create policy "Service role can manage admin config"
  on public.admin_config for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================================
-- VIEW: v_admin_stats (Admin dashboard statistics)
-- ============================================================================
create or replace view public.v_admin_stats as
with user_stats as (
  select
    count(*) as total_registered_users,
    count(distinct pais) as countries_count
  from public.makinas
),
stats_by_country as (
  select
    pais,
    count(*) as user_count
  from public.makinas
  group by pais
  order by user_count desc
),
stats_by_city_spain as (
  select
    ciudad,
    count(*) as user_count
  from public.makinas
  where pais = 'España'
  group by ciudad
  order by user_count desc
),
daily_registrations as (
  select
    date(created_at) as registration_date,
    count(*) as new_users
  from public.makinas
  where created_at >= now() - interval '30 days'
  group by date(created_at)
  order by registration_date desc
),
daily_sessions as (
  select
    date(created_at) as session_date,
    count(*) as active_sessions
  from public.sesiones_juego
  where created_at >= now() - interval '30 days'
  group by date(created_at)
  order by session_date desc
),
session_duration as (
  select
    avg(extract(epoch from (fin - inicio))) as avg_duration_seconds,
    count(*) filter (where fin is not null) as completed_sessions
  from public.sesiones_juego
  where created_at >= now() - interval '30 days'
    and fin is not null
),
points_stats as (
  select
    sum(puntos_acumulados) as total_points_accumulated,
    avg(puntos_acumulados) as avg_points_per_user
  from public.makinas
),
referrer_distribution as (
  select
    coalesce(referrer_source, 'direct') as source,
    count(*) as count
  from public.makinas
  group by referrer_source
  order by count desc
)
select
  (select total_registered_users from user_stats) as total_registered_users,
  (select json_agg(json_build_object('country', pais, 'count', user_count))
   from stats_by_country) as users_by_country,
  (select json_agg(json_build_object('city', ciudad, 'count', user_count))
   from stats_by_city_spain) as users_by_city_spain,
  (select json_agg(json_build_object('date', registration_date::text, 'new_users', new_users))
   from daily_registrations) as daily_registrations_30d,
  (select json_agg(json_build_object('date', session_date::text, 'active_sessions', active_sessions))
   from daily_sessions) as daily_active_sessions_30d,
  (select round(avg_duration_seconds::numeric, 2) from session_duration) as avg_session_duration_seconds,
  (select completed_sessions from session_duration) as completed_sessions_30d,
  (select total_points_accumulated from points_stats) as total_points_accumulated,
  (select round(avg_points_per_user::numeric, 2) from points_stats) as avg_points_per_user,
  (select json_agg(json_build_object('source', source, 'count', count))
   from referrer_distribution) as referrer_distribution;

-- Grant select on view to authenticated users (service role manages the data)
grant select on public.v_admin_stats to service_role;

-- ============================================================================
-- SAMPLE INSERT TRIGGERS FOR AUTO-UPDATE OF POINTS
-- ============================================================================
-- Trigger function to update makina points when session completes with points
create or replace function public.update_makina_points()
returns trigger as $$
begin
  if new.fin is not null and new.makina_id is not null and new.puntos_obtenidos > 0 then
    update public.makinas
    set puntos_acumulados = puntos_acumulados + new.puntos_obtenidos
    where id = new.makina_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger sesiones_juego_update_points
  after insert or update of fin, puntos_obtenidos on public.sesiones_juego
  for each row
  when (new.fin is not null and new.makina_id is not null)
  execute function public.update_makina_points();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
comment on table public.makinas is 'Registered users (Mákinas) for Luna Kosmic Songs game';
comment on table public.sesiones_juego is 'Game session analytics for both registered and anonymous players';
comment on table public.admin_config is 'Admin panel configuration storage';
comment on view public.v_admin_stats is 'Admin dashboard statistics aggregating user, session, and points data';

comment on column public.makinas.pronombre is 'Preferred pronoun(s) for the user';
comment on column public.makinas.puntos_acumulados is 'Total points earned across all game sessions';
comment on column public.makinas.puntos_gastados is 'Total points spent on rewards or features';
comment on column public.sesiones_juego.guest_fingerprint is 'Browser fingerprint for tracking anonymous sessions';
comment on column public.sesiones_juego.nivel is 'Game difficulty level: basico or avanzado';
comment on column public.sesiones_juego.canciones_completadas is 'Array of song IDs completed in this session';
