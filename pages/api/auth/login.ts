import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
  try {
    const { email, password } = req.body as LoginRequest;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
      });
    }
    const mockUser = {
      id: '1',
      email: email,
      username: email.split('@')[0],
    };
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return res.status(200).json({
      success: true,
      token: token,
      user: mockUser,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}