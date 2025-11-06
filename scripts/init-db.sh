#!/bin/bash
set -e

echo "🚀 Iniciando configuración de base de datos..."

# Esperar a que PostgreSQL esté listo
until pg_isready -U social_user -d social_media_db; do
  echo "⏳ Esperando a que PostgreSQL esté listo..."
  sleep 2
done

echo "✅ PostgreSQL está listo. Ejecutando scripts de inicialización..."

# Ejecutar scripts SQL en orden
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- =====================================================
    -- Social Media Database Schema
    -- =====================================================
    
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- =====================================================
    -- 1. USERS TABLE
    -- =====================================================
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        image_url TEXT,
        provider VARCHAR(50),
        provider_id VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
    
    -- =====================================================
    -- 2. POSTS TABLE
    -- =====================================================
    CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        media_url TEXT,
        parent_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_posts_parent_post_id ON posts(parent_post_id);
    
    -- =====================================================
    -- 3. LIKES TABLE
    -- =====================================================
    CREATE TABLE IF NOT EXISTS likes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
    CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
    
    -- =====================================================
    -- 4. REPOSTS TABLE
    -- =====================================================
    CREATE TABLE IF NOT EXISTS reposts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_reposts_user_id ON reposts(user_id);
    CREATE INDEX IF NOT EXISTS idx_reposts_post_id ON reposts(post_id);
    
    
    -- =====================================================
    -- 6. MEDIA_FILES TABLE
    -- =====================================================
    CREATE TABLE IF NOT EXISTS media_files (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'gif', 'audio')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_media_files_post_id ON media_files(post_id);
    
    -- =====================================================
    -- VIEWS
    -- =====================================================
    
    -- TIMELINE VIEW
    CREATE OR REPLACE VIEW timeline AS
    SELECT 
        p.id AS post_id,
        p.content,
        p.media_url,
        p.created_at,
        p.parent_post_id,
        u.username,
        u.name AS user_name,
        u.image_url,
        u.id AS user_id,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM reposts r WHERE r.post_id = p.id) AS reposts_count,
        (SELECT COUNT(*) FROM posts replies WHERE replies.parent_post_id = p.id) AS replies_count
    FROM 
        posts p
    INNER JOIN 
        users u ON p.user_id = u.id
    ORDER BY 
        p.created_at DESC;
    
    -- USER_STATS VIEW
    CREATE OR REPLACE VIEW user_stats AS
    SELECT 
        u.id AS user_id,
        u.username,
        u.name,
        u.image_url,
        u.bio,
        u.created_at,
        (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) AS posts_count,
        (SELECT COUNT(*) FROM likes l 
         INNER JOIN posts p ON l.post_id = p.id 
         WHERE p.user_id = u.id) AS total_likes_received
    FROM 
        users u;
    
    -- POST_DETAILS VIEW
    CREATE OR REPLACE VIEW post_details AS
    SELECT 
        p.id AS post_id,
        p.content,
        p.media_url,
        p.parent_post_id,
        p.created_at,
        u.id AS user_id,
        u.username,
        u.name AS user_name,
        u.image_url AS user_image,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM reposts r WHERE r.post_id = p.id) AS reposts_count,
        (SELECT COUNT(*) FROM posts replies WHERE replies.parent_post_id = p.id) AS replies_count,
        CASE 
            WHEN p.parent_post_id IS NOT NULL THEN
                (SELECT username FROM users WHERE id = (SELECT user_id FROM posts WHERE id = p.parent_post_id))
            ELSE NULL
        END AS parent_post_username
    FROM 
        posts p
    INNER JOIN 
        users u ON p.user_id = u.id;
    
    -- =====================================================
    -- SEED DATA
    -- =====================================================
    
    INSERT INTO users (id, name, username, email, image_url, provider, bio) VALUES
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Juan Pérez', 'juanperez', 'juan@example.com', NULL, 'credentials', 'Desarrollador full-stack apasionado por la tecnología'),
        ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'María García', 'mariagarcia', 'maria@example.com', NULL, 'credentials', 'Diseñadora UX/UI | Amante del café ☕'),
        ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Carlos López', 'carloslopez', 'carlos@example.com', NULL, 'credentials', 'Tech enthusiast | Gamer 🎮'),
        ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Ana Martínez', 'anamartinez', 'ana@example.com', NULL, 'google', 'Product Manager | Viajera 🌍')
    ON CONFLICT (email) DO NOTHING;
    
    INSERT INTO posts (id, user_id, content, created_at) VALUES
        ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '¡Hola mundo! Este es mi primer post en esta red social 🚀', NOW() - INTERVAL '2 hours'),
        ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Trabajando en un nuevo diseño increíble. ¡No puedo esperar para compartirlo! 🎨', NOW() - INTERVAL '1 hour'),
        ('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Acabo de terminar un juego increíble. ¿Alguien más jugando últimamente?', NOW() - INTERVAL '30 minutes'),
        ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Planificando mi próximo viaje. ¿Recomendaciones de destinos? 🗺️', NOW() - INTERVAL '15 minutes'),
        ('28eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aprendiendo Next.js y me está encantando. La experiencia de desarrollo es increíble!', NOW() - INTERVAL '5 minutes')
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO posts (id, user_id, content, parent_post_id, created_at) VALUES
        ('39eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '¡Bienvenido! Me alegra verte por aquí 😊', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', NOW() - INTERVAL '1 hour 50 minutes'),
        ('4aeebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Next.js es genial! También estoy aprendiéndolo', '28eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', NOW() - INTERVAL '3 minutes')
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO likes (user_id, post_id) VALUES
        ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
        ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
        ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66'),
        ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66'),
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '06eebc99-9c0b-4ef8-bb6d-6bb9bd380a77'),
        ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88'),
        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88')
    ON CONFLICT (user_id, post_id) DO NOTHING;
    
    INSERT INTO reposts (user_id, post_id) VALUES
        ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '28eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'),
        ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66')
    ON CONFLICT (user_id, post_id) DO NOTHING;
    
EOSQL

echo "✅ Base de datos configurada exitosamente!"
echo "📊 Datos de prueba insertados:"
echo "   - 4 usuarios"
echo "   - 7 posts"
echo "   - 8 likes"
echo "   - 2 reposts"
