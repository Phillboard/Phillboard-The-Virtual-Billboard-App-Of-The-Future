import { useState, useEffect } from "react";
import { LocationTracker } from "./map/LocationTracker";
import { MapBackground } from "./map/MapBackground";
import { LocationHeader } from "./map/LocationHeader";
import { PinPopup } from "./map/PinPopup";
import { CreatePinDialog } from "./map/dialogs/CreatePinDialog";
import { CreatePinButton } from "./map/CreatePinButton";
import { AdminModeToggle } from "./map/AdminModeToggle";
import { UserLocation, MapPin } from "./map/types";
import { useAuth } from "@/contexts/AuthContext";

export function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.email === "admin@phillboard.com" || user?.email?.endsWith("@lovable.ai");
  
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
  
  const handleLocationUpdate = (location: UserLocation, pins: MapPin[]) => {
    console.log("Location update received:", location);
    setUserLocation(location);
    setMapPins(pins);
  };
  
  const handleCreatePin = (newPin: MapPin) => {
    setMapPins([...mapPins, newPin]);
    setIsPlaceDialogOpen(false);
    // Reset selected location after creating a pin
    setSelectedLocation(null);
  };

  const handleMapClick = (location: UserLocation) => {
    if (isAdmin && isAdminMode) {
      setSelectedLocation(location);
      setIsPlaceDialogOpen(true);
    }
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    }
  };
  
  return (
    <div className="screen relative">
      {/* Location tracker (non-visual component) */}
      <LocationTracker 
        onLocationUpdate={handleLocationUpdate}
        onError={setError}
        onLoadingChange={setIsLoading}
      />
      
      {/* Map background with pins */}
      <MapBackground
        isLoading={isLoading}
        error={error}
        userLocation={userLocation}
        mapPins={mapPins}
        onPinSelect={setSelectedPin}
        onMapClick={handleMapClick}
        isAdminMode={isAdminMode}
      />
      
      {/* Top bar with location info */}
      <LocationHeader
        isLoading={isLoading}
        userLocation={userLocation}
        pinsCount={mapPins.length}
      />

      {/* Admin mode toggle button - extracted to its own component */}
      <AdminModeToggle
        isAdminMode={isAdminMode}
        isAdmin={isAdmin}
        onToggle={toggleAdminMode}
      />
      
      {/* Pin popup dialog */}
      <PinPopup
        selectedPin={selectedPin}
        onClose={() => setSelectedPin(null)}
      />
      
      {/* FAB for creating a new phillboard */}
      <CreatePinButton
        onClick={() => {
          setSelectedLocation(null); // Reset selected location when creating from current location
          setIsPlaceDialogOpen(true);
        }}
      />
      
      {/* Create phillboard dialog */}
      <CreatePinDialog
        isOpen={isPlaceDialogOpen}
        onOpenChange={setIsPlaceDialogOpen}
        userLocation={selectedLocation || userLocation}
        onCreatePin={handleCreatePin}
        isAdminMode={isAdminMode}
        selectedLocation={selectedLocation}
      />
    </div>
  );
}
