import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '@/lib/features/auth/authSlice';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const isAuthenticatedCombined = isAuthenticated || !!session;
  const isLoadingCombined = isLoading || status === 'loading';
  useEffect(() => {
    if (!isLoadingCombined) {
      if (requireAuth && !isAuthenticatedCombined) {
        router.push('/login');
      } else if (!requireAuth && isAuthenticatedCombined) {
        router.push('/feed');
      }
    }
  }, [isAuthenticatedCombined, isLoadingCombined, requireAuth, router]);

  if (isLoadingCombined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticatedCombined) {
    return null;
  }

  if (!requireAuth && isAuthenticatedCombined) {
    return null;
  }

  return <>{children}</>;
};
