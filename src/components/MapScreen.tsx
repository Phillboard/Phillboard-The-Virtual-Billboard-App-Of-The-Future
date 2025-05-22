
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
  // We'll remove the nearbyRadiusMiles limitation
  
  const { user, isAdmin } = useAuth();
  const userIsAdmin = isAdmin(user);
  
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

  const handlePinDelete = () => {
    // Remove the deleted pin from the local state
    if (selectedPin) {
      setMapPins(currentPins => currentPins.filter(pin => pin.id !== selectedPin.id));
      setSelectedPin(null);
    }
  };

  const handlePinUpdate = (updatedPin: MapPin) => {
    // Update the pin in the local state
    setMapPins(currentPins =>
      currentPins.map(pin => 
        pin.id === updatedPin.id ? updatedPin : pin
      )
    );
    // Update the selected pin to reflect changes
    setSelectedPin(updatedPin);
  };

  const handleMapClick = (location: UserLocation) => {
    if (userIsAdmin && isAdminMode) {
      setSelectedLocation(location);
      setIsPlaceDialogOpen(true);
    }
  };

  const toggleAdminMode = () => {
    if (userIsAdmin) {
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
        radiusMiles={5} // Set a larger default radius but it's not restrictive anymore
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
        nearbyRadius={0} // We're not using a fixed radius anymore
      />

      {/* Admin mode toggle button - extracted to its own component */}
      <AdminModeToggle
        isAdminMode={isAdminMode}
        isAdmin={userIsAdmin}
        onToggle={toggleAdminMode}
      />
      
      {/* Pin popup dialog */}
      <PinPopup
        selectedPin={selectedPin}
        onClose={() => setSelectedPin(null)}
        onPinDelete={handlePinDelete}
        onPinUpdate={handlePinUpdate}
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
