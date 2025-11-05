import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from './authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Error al iniciar sesión');
      }

      return { user: data.user, token: data.token };
    } catch (error) {
      return rejectWithValue('Error de conexión');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      return;
    } catch (error) {
      return rejectWithValue('Error al cerrar sesión');
    }
  }
);
