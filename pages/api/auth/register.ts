import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, getUserByUsername, createUser } from '@/lib/supabase/queries';
import { ApiRegisterRequest, ApiRegisterResponse } from '@/interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRegisterResponse & { user?: { id: string; email: string; username: string; name?: string; avatar?: string } }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { name, username, email, password } = req.body as ApiRegisterRequest;

    // Validaciones
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido',
      });
    }

    // Validar longitud de username
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'El username debe tener entre 3 y 20 caracteres',
      });
    }

    // Validar que username solo contenga caracteres válidos
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'El username solo puede contener letras, números y guiones bajos',
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Verificar si el email ya existe
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Verificar si el username ya existe
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'El username ya está en uso',
      });
    }
    const newUser = await createUser({
      name,
      username,
      email,
      provider: 'credentials',
      image_url: null,
      provider_id: null,
      bio: null,
    });
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

    return res.status(201).json({
      success: true,
      token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name || undefined,
        avatar: newUser.image_url || undefined,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
