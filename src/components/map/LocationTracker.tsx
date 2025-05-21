
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
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    onLoadingChange(true);
    
    // Set a timeout to provide fallback data if geolocation takes too long
    timeoutRef.current = window.setTimeout(() => {
      console.log("Geolocation timeout - using fallback data");
      provideFallbackLocation();
    }, 15000); // 15 seconds timeout
    
    if (!navigator.geolocation) {
      handleGeolocationError("Geolocation is not supported by your browser");
      return;
    }

    // Try to get initial position
    try {
      navigator.geolocation.getCurrentPosition(
        handlePositionSuccess,
        handlePositionError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    } catch (e) {
      console.error("Unexpected error in geolocation:", e);
      handleGeolocationError("Unexpected error accessing location services");
    }
    
    return () => {
      // Clean up any watchers and timeouts
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handlePositionSuccess = (position: GeolocationPosition) => {
    // Clear the timeout since we got a successful position
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const { latitude, longitude } = position.coords;
    console.log("Position obtained:", latitude, longitude);
    
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
  };
  
  const handlePositionError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error);
    handleGeolocationError(`Error getting your location: ${error.message}`);
  };
  
  const handleGeolocationError = (message: string) => {
    console.error(message);
    onError(message);
    onLoadingChange(false);
    toast.error(message);
    
    // Provide fallback location data after error
    provideFallbackLocation();
  };
  
  const provideFallbackLocation = () => {
    if (hasNotifiedSuccess.current) return; // Don't override if we already have a location
    
    console.log("Providing fallback location data");
    // San Francisco coordinates as fallback
    const fallbackLat = 37.7749;
    const fallbackLng = -122.4194;
    
    const userLocation = { lat: fallbackLat, lng: fallbackLng };
    
    // Generate map pins around fallback location
    const newPins = defaultMapPins.map((pin, idx) => ({
      ...pin,
      lat: fallbackLat + (idx * 0.001 - 0.001),
      lng: fallbackLng + (idx * 0.001 - 0.001),
      distance: `${Math.round(idx * 100 + 50)} ft`
    }));
    
    onLocationUpdate(userLocation, newPins);
    onLoadingChange(false);
    
    toast.info("Using demo location instead");
    hasNotifiedSuccess.current = true;
  };
  
  return null; // This is a non-rendering component
}
