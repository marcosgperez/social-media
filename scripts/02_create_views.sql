-- =====================================================
-- Social Media Database Views
-- =====================================================
-- This script creates useful views for the application

-- =====================================================
-- TIMELINE VIEW
-- =====================================================
-- Joins posts with users and orders by creation date descending
-- This view is optimized for displaying the main feed
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
    -- Count likes for this post
    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
    -- Count reposts for this post
    (SELECT COUNT(*) FROM reposts r WHERE r.post_id = p.id) AS reposts_count,
    -- Count replies for this post
    (SELECT COUNT(*) FROM posts replies WHERE replies.parent_post_id = p.id) AS replies_count
FROM 
    posts p
INNER JOIN 
    users u ON p.user_id = u.id
ORDER BY 
    p.created_at DESC;

-- =====================================================
-- USER_STATS VIEW
-- =====================================================
-- Provides statistics for each user
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    u.name,
    u.image_url,
    u.bio,
    u.created_at,
    -- Count posts by this user
    (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) AS posts_count,
    -- Count followers
    (SELECT COUNT(*) FROM follows f WHERE f.followed_id = u.id) AS followers_count,
    -- Count following
    (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.id) AS following_count,
    -- Count total likes received
    (SELECT COUNT(*) FROM likes l 
     INNER JOIN posts p ON l.post_id = p.id 
     WHERE p.user_id = u.id) AS total_likes_received
FROM 
    users u;

-- =====================================================
-- POST_DETAILS VIEW
-- =====================================================
-- Provides detailed information about posts including engagement metrics
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
    -- Engagement metrics
    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
    (SELECT COUNT(*) FROM reposts r WHERE r.post_id = p.id) AS reposts_count,
    (SELECT COUNT(*) FROM posts replies WHERE replies.parent_post_id = p.id) AS replies_count,
    -- Parent post info (if this is a reply)
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
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'All views created successfully!';
END $$;
