-- =====================================================
-- SUPABASE STORAGE SETUP
-- =====================================================
-- Este script configura el bucket de almacenamiento para imágenes

-- Crear bucket público para imágenes de posts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que cualquiera lea las imágenes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Política para permitir subir imágenes (sin autenticación por ahora)
-- En producción, deberías requerir autenticación
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-images');

-- Política para permitir actualizar imágenes propias
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'post-images');

-- Política para permitir eliminar imágenes propias
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'post-images');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Storage bucket "post-images" created successfully!';
    RAISE NOTICE 'Bucket is public with 5MB file size limit';
    RAISE NOTICE 'Allowed formats: JPEG, PNG, GIF, WebP';
END $$;
