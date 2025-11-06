import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPosts, createPost, likePostAsync } from './postsThunks';

export interface Post {
  id: string;
  author: {
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [
    {
      id: '1',
      author: {
        username: 'usuario1',
        avatar: '',
      },
      content: '¡Hola mundo! Este es mi primer post en la red social.',
      likes: 5,
      comments: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      author: {
        username: 'usuario2',
        avatar: '',
      },
      content: 'Compartiendo algo interesante con todos ustedes.',
      likes: 12,
      comments: 4,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  loading: false,
  error: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    likePost: (state, action: PayloadAction<{ postId: string; liked: boolean }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        if (action.payload.liked) {
          post.likes += 1;
        } else {
          post.likes = Math.max(0, post.likes - 1);
        }
      }
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al obtener posts';
    });

    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
      state.loading = false;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al crear post';
    });

    builder.addCase(likePostAsync.fulfilled, (state, action) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    });
    builder.addCase(likePostAsync.rejected, (state, action) => {
      state.error = action.error.message || 'Error al dar like';
    });
  },
});

export const {
  setPosts,
  addPost,
  likePost,
  updatePost,
  setLoading,
  setError,
  clearPosts,
} = postsSlice.actions;

export default postsSlice.reducer;
