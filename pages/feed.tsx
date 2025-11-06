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
import { Header } from '@/components/Header';
import { CreatePostForm } from '@/components/CreatePostForm';

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
  const [loading, setLoading] = useState(false);
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

  const handleCreatePost = async (content: string, selectedImage: File | null) => {
    if (!content.trim() || !token) return;
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
        body: JSON.stringify({ content, imageUrl }),
      });

      if (response.ok) {
        const post = await response.json();
        dispatch(addPost(post));
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
        <Header
          title="Feed"
          userName={session?.user?.name || `@${user?.username}`}
          onLogout={handleLogout}
          showLogoutButton={true}
        />

        <main className="max-w-3xl mx-auto px-4 pt-24 pb-6 space-y-5">
          <CreatePostForm
            onSubmit={handleCreatePost}
            loading={loading}
            uploadingImage={uploadingImage}
          />

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
