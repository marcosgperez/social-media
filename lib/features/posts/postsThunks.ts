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

export const uploadImage = createAsyncThunk(
  'posts/uploadImage',
  async ({ image, token }: { image: File; token: string }) => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.url as string;
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

export const createPostWithImage = createAsyncThunk(
  'posts/createPostWithImage',
  async ({ content, image, token }: { content: string; image: File; token: string }, { dispatch }) => {
    const imageUrl = await dispatch(uploadImage({ image, token })).unwrap();
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Error al crear post');
    }

    const data: Post = await response.json();
    return data;
  }
);

export const fetchUserLikes = createAsyncThunk(
  'posts/fetchUserLikes',
  async (token: string) => {
    const response = await fetch('/api/user/likes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al cargar likes');
    }

    const data = await response.json();
    return data.likedPostIds as string[];
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

    const data = await response.json();
    const postResponse = await fetch(`/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!postResponse.ok) {
      throw new Error('Error al obtener post actualizado');
    }
    const updatedPost: Post = await postResponse.json();
    return { postId, liked: data.liked, updatedPost };
  }
);
