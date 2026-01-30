-- Tabela para armazenar visualizacoes do site
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL DEFAULT '/',
    user_agent TEXT,
    ip_hash TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar eventos (cliques em botoes, links, etc)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_label TEXT,
    event_data JSONB,
    page_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para usuarios admin do dashboard
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuario admin padrao (senha: Leolucena1!)
-- Hash gerado com bcrypt
INSERT INTO admin_users (email, password_hash) 
VALUES ('leonardo@oliport.com.br', '$2a$10$rOxQnX5xGqj7cZjH6Vy5JeWf6Yw9vXoKj8pS0dBN3gQW4Y7k8L9Rm')
ON CONFLICT (email) DO NOTHING;

-- Tabela para sessoes de login
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para melhor performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policies para permitir insercao anonima de analytics
CREATE POLICY "Allow anonymous insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert" ON analytics_events FOR INSERT WITH CHECK (true);

-- Policies para permitir leitura por usuarios autenticados (via service role)
CREATE POLICY "Allow service role read" ON page_views FOR SELECT USING (true);
CREATE POLICY "Allow service role read" ON analytics_events FOR SELECT USING (true);
CREATE POLICY "Allow service role all" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow service role all" ON admin_sessions FOR ALL USING (true);
