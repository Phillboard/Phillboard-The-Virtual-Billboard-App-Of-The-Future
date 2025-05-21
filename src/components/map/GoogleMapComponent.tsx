
import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { UserLocation, MapPin } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Dark mode map styles
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }]
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    }
  ]
};

interface GoogleMapComponentProps {
  userLocation: UserLocation | null;
  mapPins: MapPin[];
  onPinSelect: (pin: MapPin) => void;
  isLoading: boolean;
}

export function GoogleMapComponent({ 
  userLocation, 
  mapPins, 
  onPinSelect,
  isLoading 
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDefMsHgR_YU6ojIZWpsqketVLP9yDwyu8"
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  
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

  // Update map center when user location changes without re-rendering the entire map
  useEffect(() => {
    if (mapReady && mapRef.current && userLocation) {
      console.log("Updating map center to:", userLocation);
      mapRef.current.panTo({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation, mapReady]);

  // Handle map loading error or timeout
  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-center p-4">
          <p className="mb-2">Failed to load Google Maps</p>
          <p className="text-xs">Using demo mode instead</p>
        </div>
      </div>
    );
  }

  // Show skeleton loading state
  if ((!isLoaded || isLoading) && !loadTimeout) {
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
  }

  // Default center if user location is not available
  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  
  // If we hit the timeout but Google Maps loaded, continue with the map
  return (
    <div className="absolute inset-0">
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : defaultCenter}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {userLocation && (
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          )}
          
          {mapPins.map((pin) => (
            <Marker
              key={pin.id}
              position={{ lat: pin.lat, lng: pin.lng }}
              title={pin.title}
              onClick={() => onPinSelect(pin)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: "#00FFFF",
                fillOpacity: 0.8,
                strokeColor: "#ffffff",
                strokeWeight: 1,
              }}
            />
          ))}
        </GoogleMap>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/20 rounded-lg" />
    </div>
  );
}
