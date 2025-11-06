import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectCurrentUser, selectCurrentToken } from '@/lib/features/auth/authSlice';
import { logoutUser } from '@/lib/features/auth/authThunks';
import { setPosts, selectPosts, selectLikedPostIds, selectPostsLoading, selectUploadingImage } from '@/lib/features/posts/postsSlice';
import { fetchUserLikes, likePostAsync, createPost, createPostWithImage } from '@/lib/features/posts/postsThunks';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PostCard } from '@/components/PostCard';
import { Header } from '@/components/Header';
import { CreatePostForm } from '@/components/CreatePostForm';
import { PostingProgress } from '@/components/PostingProgress';
import { Post } from '@/interfaces';

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
  const posts = useAppSelector(selectPosts);
  const likedPostIds = useAppSelector(selectLikedPostIds);
  const loading = useAppSelector(selectPostsLoading);
  const uploadingImage = useAppSelector(selectUploadingImage);
  
  useEffect(() => {
    if (initialPosts.length > 0) {
      dispatch(setPosts(initialPosts));
    }
  }, [initialPosts, dispatch]);

  // Cargar los likes del usuario usando Redux
  useEffect(() => {
    if (token) {
      dispatch(fetchUserLikes(token));
    }
  }, [token, dispatch]);

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
    
    if (selectedImage) {
      await dispatch(createPostWithImage({ content, image: selectedImage, token })).unwrap();
    } else {
      await dispatch(createPost({ content, token })).unwrap();
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) return;
    dispatch(likePostAsync({ postId, token }));
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

        <PostingProgress isUploading={uploadingImage} isPosting={loading} />

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
                  isLiked={likedPostIds.includes(post.id)}
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
