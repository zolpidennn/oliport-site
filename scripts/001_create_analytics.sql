-- Tabela para armazenar visualizações de página
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_url text not null,
  user_agent text,
  ip_hash text,
  referrer text,
  created_at timestamp with time zone default now()
);

-- Tabela para armazenar eventos de clique
create table if not exists public.click_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('whatsapp', 'instagram', 'address', 'contact_form', 'phone', 'email', 'linkedin', 'facebook')),
  element_id text,
  page_url text,
  user_agent text,
  ip_hash text,
  created_at timestamp with time zone default now()
);

-- Tabela para armazenar preferências de cookies
create table if not exists public.cookie_consents (
  id uuid primary key default gen_random_uuid(),
  consent_given boolean not null default false,
  ip_hash text,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Índices para melhorar performance de consultas por data
create index if not exists idx_page_views_created_at on public.page_views(created_at);
create index if not exists idx_click_events_created_at on public.click_events(created_at);
create index if not exists idx_click_events_event_type on public.click_events(event_type);
create index if not exists idx_cookie_consents_created_at on public.cookie_consents(created_at);

-- Habilitar RLS (Row Level Security)
alter table public.page_views enable row level security;
alter table public.click_events enable row level security;
alter table public.cookie_consents enable row level security;

-- Políticas de RLS para permitir inserção pública (anônima) mas leitura apenas autenticada
-- Inserção pública para tracking
create policy "Allow anonymous insert on page_views" on public.page_views for insert with check (true);
create policy "Allow anonymous insert on click_events" on public.click_events for insert with check (true);
create policy "Allow anonymous insert on cookie_consents" on public.cookie_consents for insert with check (true);

-- Leitura apenas para usuários autenticados (dashboard admin)
create policy "Allow authenticated read on page_views" on public.page_views for select using (auth.role() = 'authenticated');
create policy "Allow authenticated read on click_events" on public.click_events for select using (auth.role() = 'authenticated');
create policy "Allow authenticated read on cookie_consents" on public.cookie_consents for select using (auth.role() = 'authenticated');
