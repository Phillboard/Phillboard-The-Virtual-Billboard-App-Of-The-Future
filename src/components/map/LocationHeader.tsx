
import { useState, useEffect } from "react";
import { UserLocation } from "./types";
import { getFallbackLocation } from "@/utils/geocodingUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationHeaderProps {
  isLoading: boolean;
  userLocation: UserLocation | null;
  pinsCount: number;
  nearbyRadius?: number; // in miles
}

export function LocationHeader({ 
  isLoading, 
  userLocation, 
  pinsCount, 
  nearbyRadius = 0 
}: LocationHeaderProps) {
  const [locationInfo, setLocationInfo] = useState<{ city: string; state: string } | null>(null);

  useEffect(() => {
    if (!userLocation) return;
    
    // Try to get location info
    const fetchLocationInfo = async () => {
      try {
        // For this implementation, we'll use a fallback location
        // In a real app, this would call the reverseGeocode function
        const info = getFallbackLocation(userLocation.lat, userLocation.lng);
        setLocationInfo(info);
      } catch (error) {
        console.error("Error getting location info:", error);
      }
    };
    
    fetchLocationInfo();
  }, [userLocation]);

  return (
    <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-2 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm cursor-help">
                {isLoading 
                  ? "Finding your location..." 
                  : locationInfo 
                    ? `${locationInfo.city}, ${locationInfo.state}` 
                    : "Location unavailable"}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-black/80 border-neon-cyan/30 text-white">
              {userLocation 
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
                : "Coordinates unavailable"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-neon-cyan text-sm">
        {pinsCount} phillboards {nearbyRadius > 0 ? `within ${nearbyRadius} miles` : 'available'}
      </div>
    </div>
  );
}
