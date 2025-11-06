import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addPost, likePost, setPosts } from '@/lib/features/posts/postsSlice';
import { selectCurrentUser, selectCurrentToken } from '@/lib/features/auth/authSlice';
import { logoutUser } from '@/lib/features/auth/authThunks';
import type { Post } from '@/lib/features/posts/postsSlice';

interface Props {
  initialPosts: Post[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    // Importar dinámicamente para evitar problemas con SSR
    const { getTimeline } = await import('@/lib/supabase/queries');
    const timelinePosts = await getTimeline(50);
        const posts: Post[] = (timelinePosts || []).map((post: any) => {
      const transformedPost: any = {
        id: post.post_id,
        author: {
          username: post.username,
          avatar: post.image_url || '',
        },
        content: post.content,
        likes: post.likes_count || 0,
        comments: post.replies_count || 0,
        createdAt: post.created_at,
      };
      
      if (post.media_url) {
        transformedPost.image = post.media_url;
      }
      return transformedPost;
    });

    return {
      props: {
        initialPosts: posts,
      },
    };
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return {
      props: {
        initialPosts: [],
      },
    };
  }
};

const Feed = ({ initialPosts }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const posts = useAppSelector((state) => state.posts.posts);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = session?.user || user;
  useEffect(() => {
    if (initialPosts.length > 0) {
      dispatch(setPosts(initialPosts));
    }
  }, [initialPosts, dispatch]);

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: '/login' });
    } else {
      await dispatch(logoutUser());
      router.push('/login');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !token) return;
    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        const post = await response.json();
        dispatch(addPost(post));
        setNewPost('');
      }
    } catch (error) {
      console.error('Error al crear post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) return;
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(likePost(postId));
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-100">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.name || `@${user?.username}`}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">¿Qué estás pensando?</h2>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Escribe algo..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={loading || !newPost.trim()}
                className="px-6 py-3 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </form>
          </div>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-10 text-center">
                <p className="text-gray-500">
                  No hay posts todavía. ¡Sé el primero en publicar!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                      {post.author.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">@{post.author.username}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-800">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full mt-3 rounded-lg object-cover max-h-96"
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-black transition-all duration-200"
                    >
                      Likes: {post.likes}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-black transition-all duration-200">
                      Comments: {post.comments}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Feed;
