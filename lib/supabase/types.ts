// Database types for TypeScript
// These types match the database schema created in the SQL scripts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          username: string
          email: string
          image_url: string | null
          provider: string | null
          provider_id: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          username: string
          email: string
          image_url?: string | null
          provider?: string | null
          provider_id?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          username?: string
          email?: string
          image_url?: string | null
          provider?: string | null
          provider_id?: string | null
          bio?: string | null
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_url: string | null
          parent_post_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_url?: string | null
          parent_post_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_url?: string | null
          parent_post_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
        Relationships: []
      }
      reposts: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          followed_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          followed_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          followed_id?: string
          created_at?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          id: string
          post_id: string
          url: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          url: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          url?: string
          type?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      timeline: {
        Row: {
          post_id: string
          content: string
          media_url: string | null
          created_at: string
          parent_post_id: string | null
          username: string
          user_name: string | null
          image_url: string | null
          user_id: string
          likes_count: number
          reposts_count: number
          replies_count: number
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          user_id: string
          username: string
          name: string | null
          image_url: string | null
          bio: string | null
          created_at: string
          posts_count: number
          followers_count: number
          following_count: number
          total_likes_received: number
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      post_details: {
        Row: {
          post_id: string
          content: string
          media_url: string | null
          parent_post_id: string | null
          created_at: string
          user_id: string
          username: string
          user_name: string | null
          user_image: string | null
          likes_count: number
          reposts_count: number
          replies_count: number
          parent_post_username: string | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
