-- PlayLog schema. Run this in the Supabase SQL editor.

create table if not exists public.users (
  id text primary key,                 -- Google account id (NextAuth JWT sub)
  email text,
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz not null default now()
);

alter table public.users enable row level security;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,               -- Google account id (NextAuth JWT sub)
  title text not null check (char_length(title) between 1 and 200),
  image_url text,
  time_played numeric not null default 0 check (time_played >= 0),
  status text not null check (status in ('playing', 'completed', 'dropped', 'backlog')),
  rating text check (rating in ('S', 'A', 'B', 'C', 'D', 'E')),
  rating_rank smallint generated always as (
    case rating
      when 'S' then 0
      when 'A' then 1
      when 'B' then 2
      when 'C' then 3
      when 'D' then 4
      when 'E' then 5
      else 6
    end
  ) stored,
  platform text not null check (platform in ('steam', 'epic', 'playstation', 'xbox', 'gog', 'ubisoft', 'other')),
  custom_platform_name text check (char_length(custom_platform_name) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists games_user_id_idx on public.games (user_id, created_at desc);
create index if not exists games_user_time_played_idx on public.games (user_id, time_played desc);
create index if not exists games_user_rating_rank_idx on public.games (user_id, rating_rank asc);
create index if not exists games_user_title_idx on public.games (user_id, title asc);

-- Keep updated_at fresh on edits
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
  before update on public.games
  for each row execute function public.set_updated_at();

-- Lock the table down. The app talks to the DB with the service role key
-- (which bypasses RLS) and enforces per-user access in its API routes,
-- so the anon/authenticated keys get no access at all.
alter table public.games enable row level security;

-- The service role bypasses RLS but still needs table privileges. Newer
-- Supabase projects no longer grant these automatically on tables created
-- in public, so grant them explicitly (and only to service_role).
grant usage on schema public to service_role;
grant select, insert, update, delete on public.users, public.games to service_role;

-- Storage bucket for game cover images (public read so covers can render).
insert into storage.buckets (id, name, public)
values ('game-images', 'game-images', true)
on conflict (id) do nothing;
