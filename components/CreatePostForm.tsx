import React, { useState } from 'react';
import { CreatePostFormProps } from '@/interfaces';

export const CreatePostForm = ({
  onSubmit,
  loading = false,
  uploadingImage = false,
}: CreatePostFormProps) => {
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    await onSubmit(newPost, selectedImage);
    
    // Limpiar formulario después de enviar
    setNewPost('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">¿Qué estás pensando?</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Escribe algo..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          rows={3}
        />

        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full rounded-lg max-h-64 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <label className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-black transition-all duration-200 cursor-pointer flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">
              {selectedImage ? 'Cambiar imagen' : 'Agregar imagen'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={loading || uploadingImage || !newPost.trim()}
            className="flex-1 px-6 py-3 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {uploadingImage ? 'Subiendo imagen...' : loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};
