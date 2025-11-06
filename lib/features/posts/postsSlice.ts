import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPosts, createPost, createPostWithImage, uploadImage, likePostAsync, fetchUserLikes } from './postsThunks';
import { Post, PostsState } from '@/interfaces';

export type { Post };

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
  likedPostIds: [],
  loading: false,
  uploadingImage: false,
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
    setUploadingImage: (state, action: PayloadAction<boolean>) => {
      state.uploadingImage = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.likedPostIds = [];
      state.loading = false;
      state.error = null;
    },
    setLikedPosts: (state, action: PayloadAction<string[]>) => {
      state.likedPostIds = action.payload;
    },
    toggleLike: (state, action: PayloadAction<{ postId: string; liked: boolean }>) => {
      if (action.payload.liked) {
        if (!state.likedPostIds.includes(action.payload.postId)) {
          state.likedPostIds.push(action.payload.postId);
        }
      } else {
        state.likedPostIds = state.likedPostIds.filter(id => id !== action.payload.postId);
      }
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

    builder.addCase(uploadImage.pending, (state) => {
      state.uploadingImage = true;
      state.error = null;
    });
    builder.addCase(uploadImage.fulfilled, (state) => {
      state.uploadingImage = false;
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.uploadingImage = false;
      state.error = action.error.message || 'Error al subir imagen';
    });

    builder.addCase(createPostWithImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPostWithImage.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
      state.loading = false;
      state.uploadingImage = false;
    });
    builder.addCase(createPostWithImage.rejected, (state, action) => {
      state.loading = false;
      state.uploadingImage = false;
      state.error = action.error.message || 'Error al crear post con imagen';
    });

    builder.addCase(fetchUserLikes.fulfilled, (state, action) => {
      state.likedPostIds = action.payload;
    });
    builder.addCase(fetchUserLikes.rejected, (state, action) => {
      state.error = action.error.message || 'Error al cargar likes';
    });

    builder.addCase(likePostAsync.fulfilled, (state, action) => {
      const { postId, liked, updatedPost } = action.payload;
      if (liked) {
        if (!state.likedPostIds.includes(postId)) {
          state.likedPostIds.push(postId);
        }
      } else {
        state.likedPostIds = state.likedPostIds.filter(id => id !== postId);
      }
      
      const index = state.posts.findIndex(p => p.id === postId);
      if (index !== -1) {
        state.posts[index] = updatedPost;
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
  setUploadingImage,
  setError,
  clearPosts,
  setLikedPosts,
  toggleLike,
} = postsSlice.actions;

// Selectores
export const selectPosts = (state: { posts: PostsState }) => state.posts.posts;
export const selectLikedPostIds = (state: { posts: PostsState }) => state.posts.likedPostIds;
export const selectPostsLoading = (state: { posts: PostsState }) => state.posts.loading;
export const selectUploadingImage = (state: { posts: PostsState }) => state.posts.uploadingImage;
export const selectPostsError = (state: { posts: PostsState }) => state.posts.error;

export default postsSlice.reducer;
