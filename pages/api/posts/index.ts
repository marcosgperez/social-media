import type { NextApiRequest, NextApiResponse } from 'next';

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
    const [email] = decodedToken.split(':');

    const newPost = {
      id: Date.now().toString(),
      author: {
        username: email.split('@')[0],
        avatar: '',
      },
      content: content,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };
    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear post:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
