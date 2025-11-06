import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface PostCardProps {
  id: string;
  author: {
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  image?: string;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
}

export interface HeaderProps {
  title?: string;
  userName?: string;
  onLogout?: () => void;
  showLogoutButton?: boolean;
}

export interface CreatePostFormProps {
  onSubmit: (content: string, image: File | null) => Promise<void>;
  loading?: boolean;
  uploadingImage?: boolean;
}

export interface PostCardSkeletonProps {
  withImage?: boolean;
}

export interface LoginFormProps {
  error?: string | null;
  loading?: boolean;
  onSubmit?: (email: string, password: string) => void;
  onGoogleSignIn?: () => void;
  showGoogleSignIn?: boolean;
  showRegisterLink?: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  loadingSkeleton?: React.ReactNode;
}
