import { supabase } from './client';

const BUCKET_NAME = 'post-images';

/**
 * Upload an image to Supabase Storage
 * @param file - File object to upload
 * @param userId - User ID for organizing files
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File, userId: string): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error al subir la imagen');
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Public URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract path from URL
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);
  
  if (pathParts.length < 2) {
    throw new Error('Invalid image URL');
  }

  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw new Error('Error al eliminar la imagen');
  }
}

/**
 * Get public URL for an image
 * @param path - Path to the image in storage
 * @returns Public URL
 */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns true if valid, throws error if not
 */
export function validateImageFile(file: File): boolean {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('El archivo es muy grande. Máximo 5MB');
  }

  return true;
}
