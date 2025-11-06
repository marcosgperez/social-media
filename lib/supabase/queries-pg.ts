import { query } from '../db/pg-client';
import type { Database } from './types';

type User = Database['public']['Tables']['users']['Row'];

/**
 * Get user by email usando PostgreSQL directo
 */
export async function getUserByEmailPg(email: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  
  return result.rows[0] || null;
}

/**
 * Get user by username usando PostgreSQL directo
 */
export async function getUserByUsernamePg(username: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE username = $1 LIMIT 1',
    [username]
  );
  
  return result.rows[0] || null;
}

/**
 * Create user usando PostgreSQL directo
 */
export async function createUserPg(user: Database['public']['Tables']['users']['Insert']): Promise<User> {
  const result = await query(
    `INSERT INTO users (name, username, email, image_url, provider, provider_id, bio)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user.name, user.username, user.email, user.image_url, user.provider, user.provider_id, user.bio]
  );
  
  return result.rows[0];
}

/**
 * Get timeline usando PostgreSQL directo
 */
export async function getTimelinePg(limit: number = 50, offset: number = 0) {
  const result = await query(
    'SELECT * FROM timeline LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  
  // Convertir counts de string a number
  return result.rows.map((row: any) => ({
    ...row,
    likes_count: parseInt(row.likes_count) || 0,
    reposts_count: parseInt(row.reposts_count) || 0,
    replies_count: parseInt(row.replies_count) || 0,
  }));
}

/**
 * Create post usando PostgreSQL directo
 */
export async function createPostPg(post: Database['public']['Tables']['posts']['Insert']) {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, parent_post_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [post.user_id, post.content, post.media_url || null, post.parent_post_id || null]
  );
  
  return result.rows[0];
}

/**
 * Like a post usando PostgreSQL directo
 */
export async function likePostPg(userId: string, postId: string) {
  const result = await query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, post_id) DO NOTHING
     RETURNING *`,
    [userId, postId]
  );
  
  return result.rows[0];
}

/**
 * Unlike a post usando PostgreSQL directo
 */
export async function unlikePostPg(userId: string, postId: string) {
  await query(
    'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
    [userId, postId]
  );
}

/**
 * Get user's liked posts usando PostgreSQL directo
 */
export async function getUserLikedPostsPg(userId: string) {
  const result = await query(
    'SELECT post_id FROM likes WHERE user_id = $1',
    [userId]
  );
  
  return result.rows;
}

/**
 * Check if user liked a post usando PostgreSQL directo
 */
export async function hasUserLikedPostPg(userId: string, postId: string): Promise<boolean> {
  const result = await query(
    'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2 LIMIT 1',
    [userId, postId]
  );
  
  return result.rows.length > 0;
}

/**
 * Get post by ID usando PostgreSQL directo
 */
export async function getPostByIdPg(postId: string) {
  const result = await query(
    'SELECT * FROM post_details WHERE post_id = $1 LIMIT 1',
    [postId]
  );
  
  const row = result.rows[0];
  if (!row) return null;
  
  // Convertir counts de string a number
  return {
    ...row,
    likes_count: parseInt(row.likes_count) || 0,
    reposts_count: parseInt(row.reposts_count) || 0,
    replies_count: parseInt(row.replies_count) || 0,
  };
}
