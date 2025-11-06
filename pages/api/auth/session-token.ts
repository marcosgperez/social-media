import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { getUserByEmail } from '@/lib/supabase/queries';
import { SessionTokenResponse } from '@/interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SessionTokenResponse & { user?: { id: string; email: string; username: string; name?: string; avatar?: string } }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.email) {
      return res.status(401).json({
        success: false,
        message: 'No hay sesión activa',
      });
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name || undefined,
        avatar: user.image_url || undefined,
      },
    });
  } catch (error) {
    console.error('Error al generar token de sesión:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
