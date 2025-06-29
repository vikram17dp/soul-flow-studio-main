
export const LoadingState = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};
