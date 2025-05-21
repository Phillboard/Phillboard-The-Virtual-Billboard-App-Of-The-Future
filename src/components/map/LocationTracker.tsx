
import { useState, useEffect } from "react";
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
  useEffect(() => {
    onLoadingChange(true);
    
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser");
      onLoadingChange(false);
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        
        // Recalculate map pins relative to the user's location
        const newPins = defaultMapPins.map((pin, idx) => ({
          ...pin,
          lat: latitude + (idx * 0.001 - 0.001),
          lng: longitude + (idx * 0.001 - 0.001),
          // Calculate approximate distance in feet (very rough approximation)
          distance: `${Math.round(idx * 100 + 50)} ft`
        }));
        
        onLocationUpdate(userLocation, newPins);
        onLoadingChange(false);
        toast.success("Location found successfully");
      },
      (error) => {
        console.error("Error getting location:", error);
        onError(`Error getting your location: ${error.message}`);
        onLoadingChange(false);
        toast.error(`Failed to get your location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [onLocationUpdate, onError, onLoadingChange]);
  
  return null; // This is a non-rendering component
}
