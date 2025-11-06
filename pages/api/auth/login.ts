import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from '@/lib/supabase/queries';
import { ApiLoginRequest, ApiLoginResponse } from '@/interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiLoginResponse & { user?: { id: string; email: string; username: string; name?: string; avatar?: string } }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { email, password } = req.body as ApiLoginRequest;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
      });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Por ahora, aceptamos cualquier contraseña para usuarios en la DB    
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
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}