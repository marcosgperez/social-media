import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, LoginResponse, RegisterResponse } from '@/interfaces';

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

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Error al registrarse');
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
