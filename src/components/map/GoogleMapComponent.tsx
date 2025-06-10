
import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { UserLocation, MapPin } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { MapLoadingState } from "./MapLoadingState";
import { MapLoadError } from "./MapLoadError";
import { UserLocationMarker } from "./markers/UserLocationMarker";
import { MapPinMarker } from "./markers/MapPinMarker";
import { mapOptions, containerStyle, defaultCenter } from "./styles/mapStyles";

interface GoogleMapComponentProps {
  userLocation: UserLocation | null;
  mapPins: MapPin[];
  onPinSelect: (pin: MapPin) => void;
  isLoading: boolean;
  onMapClick?: (location: UserLocation) => void;
  isAdminMode?: boolean;
  preventAutoCenter?: boolean;
}

export function GoogleMapComponent({ 
  userLocation, 
  mapPins, 
  onPinSelect,
  isLoading,
  onMapClick,
  isAdminMode = false,
  preventAutoCenter = false
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDefMsHgR_YU6ojIZWpsqketVLP9yDwyu8"
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const lastUserLocationRef = useRef<UserLocation | null>(null);
  
  // Handle timeout for map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapReady && isLoaded && !loadError) {
        console.log("Map load timeout - forcing UI to continue");
        setLoadTimeout(true);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timer);
  }, [isLoaded, mapReady, loadError]);
  
  // Only set the map once on initial load to prevent re-renders
  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("Map loaded successfully");
    mapRef.current = map;
    setMapReady(true);
  }, []);

  const onUnmount = useCallback(() => {
    console.log("Map unmounted");
    mapRef.current = null;
    setMapReady(false);
  }, []);

  // Update map center when user location changes, but only if not prevented and location actually changed
  useEffect(() => {
    if (mapReady && mapRef.current && userLocation && !preventAutoCenter) {
      // Only update if this is a new location (not just a re-render)
      if (!lastUserLocationRef.current || 
          lastUserLocationRef.current.lat !== userLocation.lat || 
          lastUserLocationRef.current.lng !== userLocation.lng) {
        console.log("Updating map center to:", userLocation);
        mapRef.current.panTo({ lat: userLocation.lat, lng: userLocation.lng });
        lastUserLocationRef.current = userLocation;
      }
    }
  }, [userLocation, mapReady, preventAutoCenter]);

  // Handle map click for admin mode
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (isAdminMode && onMapClick && e.latLng) {
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      onMapClick(clickedLocation);
    }
  }, [isAdminMode, onMapClick]);

  // Handle map loading error or timeout
  if (loadError) {
    return <MapLoadError />;
  }

  // Show skeleton loading state
  if ((!isLoaded || isLoading) && !loadTimeout) {
    return <MapLoadingState />;
  }
  
  // If we hit the timeout but Google Maps loaded, continue with the map
  return (
    <div className="absolute inset-0">
      {/* Wrap the GoogleMap in a div with the cursor style for admin mode */}
      <div className={isAdminMode ? "cursor-crosshair w-full h-full" : "w-full h-full"}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : defaultCenter}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
            onClick={handleMapClick}
          >
            {userLocation && <UserLocationMarker userLocation={userLocation} />}
            
            {mapPins.map((pin) => (
              <MapPinMarker key={pin.id} pin={pin} onPinSelect={onPinSelect} />
            ))}
          </GoogleMap>
        )}
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/20 rounded-lg" />
    </div>
  );
}
