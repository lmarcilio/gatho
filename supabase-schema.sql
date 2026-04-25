-- ====================================================================================
-- BANCO DE DADOS: SEM FRONTEIRA (PostgreSQL / Supabase)
-- Execute este script no SQL Editor do seu projeto Supabase.
-- ====================================================================================

-- 1. Criação do tipo ENUM para os níveis de acesso (Roles)
CREATE TYPE user_role AS ENUM ('admin', 'membro');

-- 2. Tabela de Perfis (Profiles) - Extensão da tabela de usuários padrão (auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role DEFAULT 'membro' NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Ferramentas (Tools)
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'Freemium', -- 'Pago', 'Freemium', 'Grátis'
  is_popular BOOLEAN DEFAULT false,
  image_url TEXT,
  tool_url TEXT,
  youtube_refs JSONB, -- Links de referência (YouTube)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Prompts
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  ai_type TEXT NOT NULL, -- 'ChatGPT', 'Claude', 'Midjourney', etc.
  category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL, -- 'Iniciante', 'Intermediário', 'Avançado'
  prompt_text TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Aulas (Lessons)
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  video_url TEXT NOT NULL,
  pdf_url TEXT,
  workflow_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Cursos Parceiros (Courses)
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  description TEXT NOT NULL,
  old_price TEXT,
  price TEXT NOT NULL,
  bullets JSONB, -- Array de strings com os tópicos do curso
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela de Favoritos (User Library)
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'tool', 'prompt', 'lesson'
  item_id UUID NOT NULL, -- ID genérico (não é foreign key direta para permitir flexibilidade)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- ====================================================================================
-- SEGURANÇA: RLS (Row Level Security)
-- Protege o banco de dados. Membros só podem ler. Apenas Admins podem inserir/editar.
-- ====================================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Regras para Perfis
CREATE POLICY "Usuários podem ver seu próprio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Apenas Admins podem editar perfis" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Regras para Ferramentas / Prompts / Aulas / Cursos (Conteúdo Público para Leitura)
CREATE POLICY "Membros podem ver ferramentas" ON tools FOR SELECT USING (true);
CREATE POLICY "Membros podem ver prompts" ON prompts FOR SELECT USING (true);
CREATE POLICY "Membros podem ver aulas" ON lessons FOR SELECT USING (true);
CREATE POLICY "Membros podem ver cursos" ON courses FOR SELECT USING (true);

-- Política Global Administrativa: "Se o perfil do usuário logado tiver role = 'admin', ele pode tudo"
CREATE POLICY "Admins controlam ferramentas" ON tools FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins controlam prompts" ON prompts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins controlam aulas" ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins controlam cursos" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Regras para Favoritos (Apenas o próprio usuário gerencia seus favoritos)
CREATE POLICY "Usuário gerencia seus favoritos" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- ====================================================================================
-- TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE QUANDO O USUÁRIO SE CADASTRAR NO AUTH
-- ====================================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
