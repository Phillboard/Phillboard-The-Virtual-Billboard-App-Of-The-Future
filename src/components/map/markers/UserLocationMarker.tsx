
import { Marker } from "@react-google-maps/api";
import { UserLocation } from "../types";

interface UserLocationMarkerProps {
  userLocation: UserLocation;
}

export const UserLocationMarker = ({ userLocation }: UserLocationMarkerProps) => {
  return (
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
  );
};
