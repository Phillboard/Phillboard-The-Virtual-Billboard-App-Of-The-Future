
import React from "react";

export const MapLoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-pulse text-neon-cyan flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin mb-2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  );
};
