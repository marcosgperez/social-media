import { PostCardSkeleton } from './PostCardSkeleton';

export const FeedSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="h-8 animate-shimmer rounded w-20"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 animate-shimmer rounded w-24"></div>
            <div className="h-10 animate-shimmer rounded-lg w-28"></div>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="h-6 animate-shimmer rounded w-40 mb-4"></div>
          <div className="space-y-3">
            <div className="h-24 animate-shimmer rounded-lg"></div>
            <div className="flex gap-2">
              <div className="h-11 animate-shimmer rounded-lg w-40"></div>
              <div className="flex-1 h-11 animate-shimmer rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <PostCardSkeleton withImage={true} />
          <PostCardSkeleton withImage={false} />
          <PostCardSkeleton withImage={true} />
          <PostCardSkeleton withImage={false} />
        </div>
      </main>
    </div>
  );
};
