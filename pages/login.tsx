import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser } from '@/lib/features/auth/authThunks';
import { selectAuthError, clearError } from '@/lib/features/auth/authSlice';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginForm } from '@/components/LoginForm';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectAuthError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    dispatch(clearError());
    setLoading(true);

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push('/feed');
    } catch (err) {
      // Error handled by Redux
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/feed' });
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-700">
        <LoginForm
          error={authError}
          loading={loading}
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          showGoogleSignIn={true}
          showRegisterLink={true}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Login;
