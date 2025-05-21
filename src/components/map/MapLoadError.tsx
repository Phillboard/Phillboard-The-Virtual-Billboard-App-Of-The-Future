
import React from "react";

export const MapLoadError = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div className="text-red-400 text-center p-4">
        <p className="mb-2">Failed to load Google Maps</p>
        <p className="text-xs">Using demo mode instead</p>
      </div>
    </div>
  );
};
