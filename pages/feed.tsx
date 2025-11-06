import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectCurrentUser, selectCurrentToken } from '@/lib/features/auth/authSlice';
import { logoutUser } from '@/lib/features/auth/authThunks';
import { setPosts, addPost, likePost, updatePost } from '@/lib/features/posts/postsSlice';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PostCard } from '@/components/PostCard';

interface Post {
  id: string;
  author: {
    username: string;
    avatar: string;
  };
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  image?: string;
}

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const currentUser = session?.user || user;
  
  useEffect(() => {
    if (initialPosts.length > 0) {
      dispatch(setPosts(initialPosts));
    }
  }, [initialPosts, dispatch]);

  // Cargar los likes del usuario
  useEffect(() => {
    const loadUserLikes = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('/api/user/likes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setLikedPosts(new Set(data.likedPostIds));
        }
      } catch (error) {
        console.error('Error al cargar likes:', error);
      }
    };

    loadUserLikes();
  }, [token]);

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: '/login' });
    } else {
      await dispatch(logoutUser());
      router.push('/login');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !token) return;
    setLoading(true);
    try {
      let imageUrl = null;

      // Subir imagen si hay una seleccionada
      if (selectedImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', selectedImage);

        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error('Error al subir la imagen');
        }
        setUploadingImage(false);
      }

      // Crear post con o sin imagen
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost, imageUrl }),
      });

      if (response.ok) {
        const post = await response.json();
        dispatch(addPost(post));
        setNewPost('');
        setSelectedImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error al crear post:', error);
      alert('Error al crear el post');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Actualizar el estado de liked
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });

        // Refrescar el post desde la base de datos para obtener el contador actualizado
        const postResponse = await fetch(`/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (postResponse.ok) {
          const updatedPost = await postResponse.json();
          dispatch(updatePost(updatedPost));
        }
      }
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
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg max-h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <label className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-black transition-all duration-200 cursor-pointer flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {selectedImage ? 'Cambiar imagen' : 'Agregar imagen'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading || uploadingImage || !newPost.trim()}
                  className="flex-1 px-6 py-3 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {uploadingImage ? 'Subiendo imagen...' : loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
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
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  createdAt={post.createdAt}
                  image={post.image}
                  onLike={handleLike}
                  isLiked={likedPosts.has(post.id)}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Feed;
