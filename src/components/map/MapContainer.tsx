
import { UserLocation, MapPin } from "./types";
import { MapBackground } from "./MapBackground";
import { LocationHeader } from "./LocationHeader";
import { AdminModeToggle } from "./AdminModeToggle";
import { PinPopup } from "./PinPopup";

interface MapContainerProps {
  isLoading: boolean;
  error: string | null;
  userLocation: UserLocation | null;
  mapPins: MapPin[];
  selectedPin: MapPin | null;
  isAdminMode: boolean;
  onPinSelect: (pin: MapPin) => void;
  onMapClick: (location: UserLocation) => void;
  onPinDelete: () => void;
  onPinUpdate: (pin: MapPin) => void;
  onToggleAdminMode: () => void;
  userIsAdmin: boolean;
}

export function MapContainer({
  isLoading,
  error,
  userLocation,
  mapPins,
  selectedPin,
  isAdminMode,
  onPinSelect,
  onMapClick,
  onPinDelete,
  onPinUpdate,
  onToggleAdminMode,
  userIsAdmin
}: MapContainerProps) {
  return (
    <>
      {/* Map background with pins */}
      <MapBackground
        isLoading={isLoading}
        error={error}
        userLocation={userLocation}
        mapPins={mapPins}
        onPinSelect={onPinSelect}
        onMapClick={onMapClick}
        isAdminMode={isAdminMode}
      />
      
      {/* Top bar with location info */}
      <LocationHeader
        isLoading={isLoading}
        userLocation={userLocation}
        pinsCount={mapPins.length}
        nearbyRadius={0} // We're not using a fixed radius anymore
      />

      {/* Admin mode toggle button */}
      <AdminModeToggle
        isAdminMode={isAdminMode}
        isAdmin={userIsAdmin}
        onToggle={onToggleAdminMode}
      />
      
      {/* Pin popup dialog */}
      <PinPopup
        selectedPin={selectedPin}
        onClose={() => onPinSelect(null)}
        onPinDelete={onPinDelete}
        onPinUpdate={onPinUpdate}
      />
    </>
  );
}
