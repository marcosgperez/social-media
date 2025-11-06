import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserLikedPostsPg } from '@/lib/supabase/queries-pg';

const useDirectPg = !!process.env.DATABASE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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

    let likedPostIds: string[] = [];

    if (useDirectPg) {
      const data = await getUserLikedPostsPg(userId);
      likedPostIds = data?.map((like: { post_id: string }) => like.post_id) || [];
    } else {
      const { supabase } = await import('@/lib/supabase/client');
      const { data, error } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);

      if (error) throw error;
      likedPostIds = data?.map(like => like.post_id) || [];
    }

    return res.status(200).json({ likedPostIds });
  } catch (error) {
    console.error('Error al obtener likes:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
