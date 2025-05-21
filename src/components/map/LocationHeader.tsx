
import { UserLocation } from "./types";

interface LocationHeaderProps {
  isLoading: boolean;
  userLocation: UserLocation | null;
  pinsCount: number;
}

export function LocationHeader({ isLoading, userLocation, pinsCount }: LocationHeaderProps) {
  return (
    <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-2 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="text-sm">
          {isLoading 
            ? "Finding your location..." 
            : userLocation 
              ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
              : "Location unavailable"}
        </span>
      </div>
      <div className="text-neon-cyan text-sm">{pinsCount} phillboards nearby</div>
    </div>
  );
}
