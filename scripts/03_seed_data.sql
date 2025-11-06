-- =====================================================
-- Social Media Database Seed Data
-- =====================================================
-- This script inserts sample data for testing purposes
-- WARNING: Only run this in development/testing environments!

-- =====================================================
-- SEED USERS
-- =====================================================
INSERT INTO users (id, name, username, email, image_url, provider, bio) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Juan Pérez', 'juanperez', 'juan@example.com', NULL, 'credentials', 'Desarrollador full-stack apasionado por la tecnología'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'María García', 'mariagarcia', 'maria@example.com', NULL, 'credentials', 'Diseñadora UX/UI | Amante del café ☕'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Carlos López', 'carloslopez', 'carlos@example.com', NULL, 'credentials', 'Tech enthusiast | Gamer 🎮'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Ana Martínez', 'anamartinez', 'ana@example.com', NULL, 'google', 'Product Manager | Viajera 🌍')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED POSTS
-- =====================================================
INSERT INTO posts (id, user_id, content, created_at) VALUES
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '¡Hola mundo! Este es mi primer post en esta red social 🚀', NOW() - INTERVAL '2 hours'),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Trabajando en un nuevo diseño increíble. ¡No puedo esperar para compartirlo! 🎨', NOW() - INTERVAL '1 hour'),
    ('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Acabo de terminar un juego increíble. ¿Alguien más jugando últimamente?', NOW() - INTERVAL '30 minutes'),
    ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Planificando mi próximo viaje. ¿Recomendaciones de destinos? 🗺️', NOW() - INTERVAL '15 minutes'),
    ('28eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aprendiendo Next.js y me está encantando. La experiencia de desarrollo es increíble!', NOW() - INTERVAL '5 minutes')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED REPLIES (Posts with parent_post_id)
-- =====================================================
INSERT INTO posts (id, user_id, content, parent_post_id, created_at) VALUES
    ('39eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '¡Bienvenido! Me alegra verte por aquí 😊', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', NOW() - INTERVAL '1 hour 50 minutes'),
    ('4aeebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Next.js es genial! También estoy aprendiéndolo', '28eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', NOW() - INTERVAL '3 minutes')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED LIKES
-- =====================================================
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

-- =====================================================
-- SEED REPOSTS
-- =====================================================
INSERT INTO reposts (user_id, post_id) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '28eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66')
ON CONFLICT (user_id, post_id) DO NOTHING;

-- =====================================================
-- SEED FOLLOWS
-- =====================================================
INSERT INTO follows (follower_id, followed_id) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22')
ON CONFLICT (follower_id, followed_id) DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Users: 4, Posts: 7, Likes: 8, Reposts: 2, Follows: 6';
END $$;
