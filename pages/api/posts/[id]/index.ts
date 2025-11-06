import type { NextApiRequest, NextApiResponse } from 'next';
import { getPostById } from '@/lib/supabase/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { id: postId } = req.query;
    
    if (!postId || typeof postId !== 'string') {
      return res.status(400).json({ message: 'ID de post inválido' });
    }

    const postDetails = await getPostById(postId);

    if (!postDetails) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Transformar al formato esperado por el frontend
    const post: any = {
      id: postDetails.post_id,
      author: {
        username: postDetails.username,
        avatar: postDetails.user_image || '',
      },
      content: postDetails.content,
      likes: postDetails.likes_count || 0,
      comments: postDetails.replies_count || 0,
      createdAt: postDetails.created_at,
    };

    if (postDetails.media_url) {
      post.image = postDetails.media_url;
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error al obtener post:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
