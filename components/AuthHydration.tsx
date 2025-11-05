import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { hydrateAuth } from '@/lib/features/auth/authSlice';

export const AuthHydration = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
};