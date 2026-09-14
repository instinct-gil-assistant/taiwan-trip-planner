create table if not exists trip_state (
  trip_id text primary key,
  data jsonb not null default '{"version":1,"items":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into trip_state(trip_id,data)
values ('taiwan-gil-dana','{"version":1,"items":[]}'::jsonb)
on conflict (trip_id) do nothing;
