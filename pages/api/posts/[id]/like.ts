import type { NextApiRequest, NextApiResponse } from 'next';
import { likePost, unlikePost, hasUserLikedPost } from '@/lib/supabase/queries';

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
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decodedToken.split(':');
    const { id: postId } = req.query;
    if (!postId || typeof postId !== 'string') {
      return res.status(400).json({ message: 'ID de post inválido' });
    }
    const alreadyLiked = await hasUserLikedPost(userId, postId);
    if (alreadyLiked) {
      await unlikePost(userId, postId);
      return res.status(200).json({ success: true, liked: false });
    } else {
      await likePost(userId, postId);
      return res.status(200).json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('Error al dar like:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}