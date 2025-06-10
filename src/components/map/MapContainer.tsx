
import { UserLocation, MapPin } from "./types";
import { MapBackground } from "./MapBackground";
import { LocationHeader } from "./LocationHeader";
import { AdminModeToggle } from "./AdminModeToggle";
import { PinPopup } from "./PinPopup";
import { SearchAndFilter } from "../search/SearchAndFilter";
import { usePhillboardFiltering } from "@/hooks/usePhillboardFiltering";

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
  isEditDialogOpen?: boolean;
  isDeleteDialogOpen?: boolean;
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
  userIsAdmin,
  isEditDialogOpen = false,
  isDeleteDialogOpen = false
}: MapContainerProps) {
  const {
    filteredItems: filteredPins,
    setSearchQuery,
    setFilters,
    hasActiveFilters
  } = usePhillboardFiltering(mapPins);

  // Prevent auto-centering when any dialog is open OR when a pin is selected
  const preventAutoCenter = isEditDialogOpen || isDeleteDialogOpen || !!selectedPin;

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="absolute top-16 left-4 right-4 z-10">
        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          searchPlaceholder="Search phillboards on map..."
        />
        
        {hasActiveFilters && (
          <div className="mt-2 text-sm text-white bg-black/60 rounded px-2 py-1">
            Showing {filteredPins.length} of {mapPins.length} phillboards
          </div>
        )}
      </div>

      {/* Map background with filtered pins */}
      <MapBackground
        isLoading={isLoading}
        error={error}
        userLocation={userLocation}
        mapPins={filteredPins}
        onPinSelect={onPinSelect}
        onMapClick={onMapClick}
        isAdminMode={isAdminMode}
        preventAutoCenter={preventAutoCenter}
      />
      
      {/* Top bar with location info */}
      <LocationHeader
        isLoading={isLoading}
        userLocation={userLocation}
        pinsCount={filteredPins.length}
        nearbyRadius={0}
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
