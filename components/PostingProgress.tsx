import { useEffect, useState } from 'react';

interface PostingProgressProps {
  isUploading: boolean;
  isPosting: boolean;
}

export const PostingProgress = ({ isUploading, isPosting }: PostingProgressProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [wasPosting, setWasPosting] = useState(false);

  useEffect(() => {
    if (isPosting || isUploading) {
      setWasPosting(true);
      setShowSuccess(false);
    } else if (wasPosting) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setWasPosting(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPosting, isUploading, wasPosting]);

  if (!isUploading && !isPosting && !showSuccess) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl p-4 min-w-[320px] border border-gray-200 z-50 animate-slide-up">
      {showSuccess ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">¡Post publicado!</p>
            <p className="text-sm text-gray-500">Tu post se ha publicado exitosamente</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {isUploading ? 'Subiendo imagen...' : 'Publicando post...'}
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-progress"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isUploading ? 'Esto puede tomar unos segundos...' : 'Casi listo...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
