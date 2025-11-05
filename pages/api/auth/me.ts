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
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [email] = decodedToken.split(':');
    const user = {
      id: '1',
      email: email,
      username: email.split('@')[0],
      avatar: '',
    };
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error en me:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
}