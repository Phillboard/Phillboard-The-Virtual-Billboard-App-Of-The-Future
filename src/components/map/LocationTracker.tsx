
import { useState, useEffect, useRef } from "react";
import { UserLocation, MapPin } from "./types";
import { toast } from "sonner";
import { fetchNearbyPhillboards } from "@/services/phillboardService";

interface LocationTrackerProps {
  onLocationUpdate: (location: UserLocation, pins: MapPin[]) => void;
  onError: (error: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  radiusMiles?: number;
}

export function LocationTracker({ 
  onLocationUpdate, 
  onError, 
  onLoadingChange,
  radiusMiles = 0.5
}: LocationTrackerProps) {
  const hasNotifiedSuccess = useRef(false);
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
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handlePositionSuccess = async (position: GeolocationPosition) => {
    // Clear the timeout since we got a successful position
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const { latitude, longitude } = position.coords;
    console.log("Position obtained:", latitude, longitude);
    
    const userLocation = { lat: latitude, lng: longitude };
    
    try {
      // Fetch real phillboards from database within specified radius
      const phillboards = await fetchNearbyPhillboards(userLocation, radiusMiles);
      onLocationUpdate(userLocation, phillboards);
      onLoadingChange(false);
      
      // Only show success toast once
      if (!hasNotifiedSuccess.current) {
        toast.success("Location found successfully");
        hasNotifiedSuccess.current = true;
      }
    } catch (error) {
      console.error("Error fetching phillboards:", error);
      
      // Fallback to default pins if database fetch fails
      const defaultPins = createDefaultPins(latitude, longitude);
      onLocationUpdate(userLocation, defaultPins);
      onLoadingChange(false);
      
      toast.error("Failed to load phillboards from database");
      
      if (!hasNotifiedSuccess.current) {
        hasNotifiedSuccess.current = true;
      }
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
  
  const provideFallbackLocation = async () => {
    if (hasNotifiedSuccess.current) return; // Don't override if we already have a location
    
    console.log("Providing fallback location data");
    // San Francisco coordinates as fallback
    const fallbackLat = 37.7749;
    const fallbackLng = -122.4194;
    
    const userLocation = { lat: fallbackLat, lng: fallbackLng };
    
    try {
      // Try to fetch real phillboards even with fallback location, using specified radius
      const phillboards = await fetchNearbyPhillboards(userLocation, radiusMiles);
      onLocationUpdate(userLocation, phillboards);
    } catch (error) {
      console.error("Error fetching phillboards with fallback location:", error);
      
      // Use default pins as last resort
      const defaultPins = createDefaultPins(fallbackLat, fallbackLng);
      onLocationUpdate(userLocation, defaultPins);
    }
    
    onLoadingChange(false);
    toast.info("Using demo location instead");
    hasNotifiedSuccess.current = true;
  };
  
  const createDefaultPins = (centerLat: number, centerLng: number): MapPin[] => {
    return [
      {
        id: "default-1",
        lat: centerLat + 0.001,
        lng: centerLng - 0.001,
        title: "Downtown Digital",
        username: "CyberAlex",
        distance: "350 ft",
        image_type: "image-1"
      },
      {
        id: "default-2",
        lat: centerLat - 0.0005,
        lng: centerLng + 0.001,
        title: "Tech Hub",
        username: "NeonRider",
        distance: "520 ft",
        image_type: "image-2"
      },
      {
        id: "default-3",
        lat: centerLat + 0.0008,
        lng: centerLng + 0.0005,
        title: "Future Now",
        username: "DigitalNomad",
        distance: "280 ft",
        image_type: "image-3"
      }
    ];
  };
  
  return null; // This is a non-rendering component
}
