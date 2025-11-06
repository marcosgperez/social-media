import { supabase } from './client';
import type { Database } from './types';

// Importar queries de PostgreSQL directo
import { 
  getUserByEmailPg, 
  getUserByUsernamePg, 
  createUserPg, 
  getTimelinePg,
  createPostPg,
  likePostPg,
  unlikePostPg,
  getUserLikedPostsPg,
  hasUserLikedPostPg,
  getPostByIdPg
} from './queries-pg';

type User = Database['public']['Tables']['users']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];
type PostDetails = Database['public']['Views']['post_details']['Row'];

// Detectar si estamos usando PostgreSQL directo
const useDirectPg = !!process.env.DATABASE_URL && typeof window === 'undefined';

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  if (useDirectPg) {
    return await getUserByEmailPg(email);
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  if (useDirectPg) {
    return await getUserByUsernamePg(username);
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Create a new user
 */
export async function createUser(user: Database['public']['Tables']['users']['Insert']): Promise<User> {
  if (useDirectPg) {
    return await createUserPg(user);
  }
  
  const { data, error} = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// POST QUERIES
// =====================================================

/**
 * Get timeline (all posts ordered by date)
 */
export async function getTimeline(limit: number = 50, offset: number = 0) {
  if (useDirectPg) {
    return await getTimelinePg(limit, offset);
  }
  
  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

/**
 * Get posts by user
 */
export async function getPostsByUser(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('post_details')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get post by ID with details
 */
export async function getPostById(postId: string): Promise<PostDetails> {
  if (useDirectPg) {
    return await getPostByIdPg(postId);
  }
  
  const { data, error } = await supabase
    .from('post_details')
    .select('*')
    .eq('post_id', postId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new post
 */
export async function createPost(post: Database['public']['Tables']['posts']['Insert']): Promise<Post> {
  if (useDirectPg) {
    return await createPostPg(post);
  }
  
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

/**
 * Get replies to a post
 */
export async function getReplies(postId: string) {
  const { data, error } = await supabase
    .from('post_details')
    .select('*')
    .eq('parent_post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// =====================================================
// LIKE QUERIES
// =====================================================

/**
 * Like a post
 */
export async function likePost(userId: string, postId: string) {
  if (useDirectPg) {
    return await likePostPg(userId, postId);
  }
  
  const { data, error } = await supabase
    .from('likes')
    .insert({ user_id: userId, post_id: postId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Unlike a post
 */
export async function unlikePost(userId: string, postId: string) {
  if (useDirectPg) {
    return await unlikePostPg(userId, postId);
  }
  
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) throw error;
}

/**
 * Check if user liked a post
 */
export async function hasUserLikedPost(userId: string, postId: string) {
  if (useDirectPg) {
    return await hasUserLikedPostPg(userId, postId);
  }
  
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

/**
 * Get users who liked a post
 */
export async function getPostLikes(postId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('user_id, users(*)')
    .eq('post_id', postId);

  if (error) throw error;
  return data;
}

// =====================================================
// REPOST QUERIES
// =====================================================

/**
 * Repost a post
 */
export async function repostPost(userId: string, postId: string) {
  const { data, error } = await supabase
    .from('reposts')
    .insert({ user_id: userId, post_id: postId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Unrepost a post
 */
export async function unrepostPost(userId: string, postId: string) {
  const { error } = await supabase
    .from('reposts')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) throw error;
}

/**
 * Check if user reposted a post
 */
export async function hasUserRepostedPost(userId: string, postId: string) {
  const { data, error } = await supabase
    .from('reposts')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// =====================================================
// FOLLOW QUERIES
// =====================================================

/**
 * Follow a user
 */
export async function followUser(followerId: string, followedId: string) {
  const { data, error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, followed_id: followedId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followedId: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('followed_id', followedId);

  if (error) throw error;
}

/**
 * Check if user follows another user
 */
export async function isFollowing(followerId: string, followedId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('followed_id', followedId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

/**
 * Get user's followers
 */
export async function getFollowers(userId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id, users!follows_follower_id_fkey(*)')
    .eq('followed_id', userId);

  if (error) throw error;
  return data;
}

/**
 * Get users that a user follows
 */
export async function getFollowing(userId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('followed_id, users!follows_followed_id_fkey(*)')
    .eq('follower_id', userId);

  if (error) throw error;
  return data;
}

// =====================================================
// MEDIA QUERIES
// =====================================================

/**
 * Add media to a post
 */
export async function addMediaToPost(postId: string, url: string, type: string) {
  const { data, error } = await supabase
    .from('media_files')
    .insert({ post_id: postId, url, type })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get media for a post
 */
export async function getPostMedia(postId: string) {
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .eq('post_id', postId);

  if (error) throw error;
  return data;
}
