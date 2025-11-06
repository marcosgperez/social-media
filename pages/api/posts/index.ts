import type { NextApiRequest, NextApiResponse } from 'next';
import { createPost } from '@/lib/supabase/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const token = authHeader.substring(7);
    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decodedToken.split(':');
    const dbPost = await createPost({
      user_id: userId,
      content: content.trim(),
    });
    const { getPostById } = await import('@/lib/supabase/queries');
    const postDetails = await getPostById(dbPost.id);
    const newPost: any = {
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
      newPost.image = postDetails.media_url;
    }
    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear post:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
