
import { UserLocation } from "../types";

interface AdminLocationInfoProps {
  isCustomLocation: boolean;
  isAdminMode: boolean;
  locationToUse: UserLocation | null;
}

export function AdminLocationInfo({ isCustomLocation, isAdminMode, locationToUse }: AdminLocationInfoProps) {
  if (!isCustomLocation || !isAdminMode || !locationToUse) {
    return null;
  }

  return (
    <div className="bg-black/40 border border-neon-cyan/30 rounded-md p-2 text-xs">
      <p className="font-medium text-neon-cyan mb-1">Admin Mode: Custom Location</p>
      <p>Lat: {locationToUse.lat.toFixed(6)}</p>
      <p>Lng: {locationToUse.lng.toFixed(6)}</p>
    </div>
  );
}
