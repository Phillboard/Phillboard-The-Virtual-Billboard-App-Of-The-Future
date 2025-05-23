
export function LoadingState() {
  return (
    <div className="flex flex-col space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg border border-gray-800 bg-black/60 animate-pulse">
          <div className="w-1/2 h-4 bg-gray-800 rounded mb-3"></div>
          <div className="w-3/4 h-3 bg-gray-800 rounded mb-2"></div>
          <div className="w-1/3 h-3 bg-gray-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}
