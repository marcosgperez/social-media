import { Post } from './Post';

export interface PostsState {
  posts: Post[];
  likedPostIds: string[];
  loading: boolean;
  uploadingImage: boolean;
  error: string | null;
}

export interface CounterState {
  value: number;
}
