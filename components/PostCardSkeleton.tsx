import { PostCardSkeletonProps } from '@/interfaces';

export const PostCardSkeleton = ({ withImage = false }: PostCardSkeletonProps) => {
  return (
    <article className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 animate-shimmer rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 animate-shimmer rounded w-24"></div>
          <div className="h-3 animate-shimmer rounded w-20"></div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="h-4 animate-shimmer rounded w-full"></div>
        <div className="h-4 animate-shimmer rounded w-5/6"></div>
        <div className="h-4 animate-shimmer rounded w-4/6"></div>
        
        {withImage && (
          <div className="w-full h-64 animate-shimmer rounded-lg mt-3"></div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="h-10 animate-shimmer rounded-lg w-20"></div>
      </div>
    </article>
  );
};
