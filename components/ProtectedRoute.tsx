import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '@/lib/features/auth/authSlice';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: Props) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
      } else if (!requireAuth && isAuthenticated) {
        router.push('/feed');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
