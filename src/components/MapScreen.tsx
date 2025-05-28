
import { useState } from "react";
import { LocationTracker } from "./map/LocationTracker";
import { CreatePinDialog } from "./map/dialogs/CreatePinDialog";
import { CreatePinButton } from "./map/CreatePinButton";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, UserLocation } from "./map/types";
import { useMapState } from "./map/hooks/useMapState";
import { MapContainer } from "./map/MapContainer";

export function MapScreen() {
  const {
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
  } = useMapState();
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const userIsAdmin = isAdmin(user);
  
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
      
      <MapContainer
        isLoading={isLoading}
        error={error}
        userLocation={userLocation}
        mapPins={mapPins}
        selectedPin={selectedPin}
        isAdminMode={isAdminMode}
        onPinSelect={setSelectedPin}
        onMapClick={handleMapClick}
        onPinDelete={handlePinDelete}
        onPinUpdate={handlePinUpdate}
        onToggleAdminMode={toggleAdminMode}
        userIsAdmin={userIsAdmin}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
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
