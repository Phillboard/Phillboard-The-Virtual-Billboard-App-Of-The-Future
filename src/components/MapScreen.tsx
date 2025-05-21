
import { useState } from "react";
import { LocationTracker } from "./map/LocationTracker";
import { MapBackground } from "./map/MapBackground";
import { LocationHeader } from "./map/LocationHeader";
import { PinPopup } from "./map/PinPopup";
import { CreatePinDialog } from "./map/CreatePinDialog";
import { CreatePinButton } from "./map/CreatePinButton";
import { UserLocation, MapPin } from "./map/types";

export function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleLocationUpdate = (location: UserLocation, pins: MapPin[]) => {
    setUserLocation(location);
    setMapPins(pins);
  };
  
  const handleCreatePin = (newPin: MapPin) => {
    setMapPins([...mapPins, newPin]);
    setIsPlaceDialogOpen(false);
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
      />
      
      {/* Top bar with location info */}
      <LocationHeader
        isLoading={isLoading}
        userLocation={userLocation}
        pinsCount={mapPins.length}
      />
      
      {/* Pin popup dialog */}
      <PinPopup
        selectedPin={selectedPin}
        onClose={() => setSelectedPin(null)}
      />
      
      {/* FAB for creating a new phillboard */}
      <CreatePinButton
        onClick={() => setIsPlaceDialogOpen(true)}
      />
      
      {/* Create phillboard dialog */}
      <CreatePinDialog
        isOpen={isPlaceDialogOpen}
        onOpenChange={setIsPlaceDialogOpen}
        userLocation={userLocation}
        onCreatePin={handleCreatePin}
      />
    </div>
  );
}
