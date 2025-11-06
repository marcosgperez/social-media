import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { hydrateAuth, setCredentials } from '@/lib/features/auth/authSlice';
import { selectIsAuthenticated } from '@/lib/features/auth/authSlice';

export const AuthHydration = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);
  useEffect(() => {
    const syncNextAuthSession = async () => {
      if (session && status === 'authenticated' && !isAuthenticated) {
        try {
          const response = await fetch('/api/auth/session-token');
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.token && data.user) {
              dispatch(setCredentials({
                user: {
                  id: data.user.id,
                  email: data.user.email,
                  username: data.user.username,
                  avatar: data.user.avatar,
                },
                token: data.token,
              }));
            }
          }
        } catch (error) {
          console.error('Error al sincronizar sesión de NextAuth:', error);
        }
      }
    };

    syncNextAuthSession();
  }, [session, status, isAuthenticated, dispatch]);

  return <>{children}</>;
};