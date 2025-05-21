
import { useState, useEffect, useRef } from "react";
import { UserLocation, MapPin, defaultMapPins } from "./types";
import { toast } from "sonner";

interface LocationTrackerProps {
  onLocationUpdate: (location: UserLocation, pins: MapPin[]) => void;
  onError: (error: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export function LocationTracker({ 
  onLocationUpdate, 
  onError, 
  onLoadingChange 
}: LocationTrackerProps) {
  const hasNotifiedSuccess = useRef(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    onLoadingChange(true);
    
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser");
      onLoadingChange(false);
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        
        // Generate map pins around user's location
        const newPins = defaultMapPins.map((pin, idx) => ({
          ...pin,
          lat: latitude + (idx * 0.001 - 0.001),
          lng: longitude + (idx * 0.001 - 0.001),
          distance: `${Math.round(idx * 100 + 50)} ft`
        }));
        
        onLocationUpdate(userLocation, newPins);
        onLoadingChange(false);
        
        // Only show success toast once
        if (!hasNotifiedSuccess.current) {
          toast.success("Location found successfully");
          hasNotifiedSuccess.current = true;
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        onError(`Error getting your location: ${error.message}`);
        onLoadingChange(false);
        toast.error(`Failed to get your location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    
    // Don't use watchPosition to reduce potential for map glitching
    // We'll only get the position once instead of continuously updating
    
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [onLocationUpdate, onError, onLoadingChange]);
  
  return null; // This is a non-rendering component
}
