import type { NextApiRequest, NextApiResponse } from 'next';

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
    const mockPosts = [
      {
        id: '1',
        author: {
          username: 'usuario1',
          avatar: '',
        },
        content: '¡Hola mundo! Este es mi primer post en la red social.',
        likes: 5,
        comments: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        author: {
          username: 'usuario2',
          avatar: '',
        },
        content: 'Compartiendo algo interesante con todos ustedes.',
        likes: 12,
        comments: 4,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    return res.status(200).json(mockPosts);
  } catch (error) {
    console.error('Error al obtener feed:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}