import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser } from '@/lib/features/auth/authThunks';
import { selectAuthError, clearError } from '@/lib/features/auth/authSlice';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectAuthError);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setLoading(true);

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      router.push('/feed');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-700">
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Iniciar Sesión</h1>
            
            {authError && (
              <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-4 animate-slide-in">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-semibold mb-2 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-semibold mb-2 text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Login;
