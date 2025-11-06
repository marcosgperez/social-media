import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { uploadImage, validateImageFile } from '@/lib/supabase/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    // Verificar autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const token = authHeader.substring(7);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    // Decodificar token para obtener user_id
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decodedToken.split(':');

    // Parse form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'No se proporcionó ninguna imagen' });
    }

    // Leer el archivo
    const fileBuffer = fs.readFileSync(imageFile.filepath);
    const file = new globalThis.File(
      [fileBuffer],
      imageFile.originalFilename || 'image.jpg',
      { type: imageFile.mimetype || 'image/jpeg' }
    );

    // Validar archivo
    try {
      validateImageFile(file);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Subir a Supabase Storage
    const imageUrl = await uploadImage(file, userId);

    // Limpiar archivo temporal
    fs.unlinkSync(imageFile.filepath);

    return res.status(200).json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al subir la imagen',
    });
  }
}
