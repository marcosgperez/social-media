import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '@/lib/features/auth/authSlice';
import { FeedSkeleton } from './FeedSkeleton';
import { LoginSkeleton } from './LoginSkeleton';
import { ProtectedRouteProps } from '@/interfaces';

export const ProtectedRoute = ({ children, requireAuth = true, loadingSkeleton }: ProtectedRouteProps) => {
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
    if (loadingSkeleton) {
      return <>{loadingSkeleton}</>;
    }
    if (requireAuth) {
      return <FeedSkeleton />;
    }
    return <LoginSkeleton />;
  }

  if (requireAuth && !isAuthenticatedCombined) {
    return null;
  }
  if (!requireAuth && isAuthenticatedCombined) {
    return <FeedSkeleton />;
  }

  return <>{children}</>;
};
