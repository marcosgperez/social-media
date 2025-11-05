import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Post } from './postsSlice';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (token: string) => {
    const response = await fetch('/api/posts/feed', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener posts');
    }

    const data: Post[] = await response.json();
    return data;
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ content, token }: { content: string; token: string }) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Error al crear post');
    }

    const data: Post = await response.json();
    return data;
  }
);

export const likePostAsync = createAsyncThunk(
  'posts/likePost',
  async ({ postId, token }: { postId: string; token: string }) => {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al dar like');
    }

    return postId;
  }
);
