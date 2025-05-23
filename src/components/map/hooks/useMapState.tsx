
import { useState, useEffect } from 'react';
import { UserLocation, MapPin } from "../types";

export function useMapState() {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  
  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Forcing loading state to complete after timeout");
        setIsLoading(false);
      }
    }, 20000); // 20 seconds timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  return {
    selectedPin,
    setSelectedPin,
    isPlaceDialogOpen,
    setIsPlaceDialogOpen,
    userLocation,
    setUserLocation,
    mapPins,
    setMapPins,
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedLocation,
    setSelectedLocation
  };
}
