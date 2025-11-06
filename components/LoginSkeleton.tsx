export const LoginSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md">
        <div className="space-y-6">
          <div className="h-9 animate-shimmer rounded w-48"></div>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="h-4 animate-shimmer rounded w-16"></div>
              <div className="h-12 animate-shimmer rounded-lg"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 animate-shimmer rounded w-24"></div>
              <div className="h-12 animate-shimmer rounded-lg"></div>
            </div>
            
            <div className="h-14 animate-shimmer rounded-lg"></div>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="h-4 bg-white px-2 w-32 rounded"></div>
            </div>
          </div>
          
          <div className="h-14 animate-shimmer rounded-lg"></div>
          
          <div className="flex justify-center">
            <div className="h-4 animate-shimmer rounded w-48"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
