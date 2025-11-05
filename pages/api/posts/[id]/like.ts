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
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al dar like:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}