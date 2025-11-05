import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import postsReducer from './features/posts/postsSlice';
import authReducer from './features/auth/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      posts: postsReducer,
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];