-- تماس‌بان: a single SHARED team book. Every signed-in member reads and writes
-- the same rows by design (no user_id column) — that is the product ask.

create table if not exists contacts (
  id text primary key,
  national text not null,
  e164 text not null,
  local text not null,
  last_name text not null default '',
  first_name text not null default '',
  company text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists contacts_national_key on contacts (national);

create table if not exists calls (
  id text primary key,
  contact_id text not null references contacts (id) on delete cascade,
  reason text not null default '',
  at timestamptz not null default now()
);

create index if not exists calls_contact_id_idx on calls (contact_id);
