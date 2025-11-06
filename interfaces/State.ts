import { Post } from './Post';

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export interface CounterState {
  value: number;
}
