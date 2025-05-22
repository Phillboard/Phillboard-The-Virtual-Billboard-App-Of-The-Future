
import { Marker } from "@react-google-maps/api";
import { MapPin } from "../types";

interface MapPinMarkerProps {
  pin: MapPin;
  onPinSelect: (pin: MapPin) => void;
}

export const MapPinMarker = ({ pin, onPinSelect }: MapPinMarkerProps) => {
  // Determine marker style based on placement type
  const getMarkerStyle = () => {
    switch (pin.placement_type) {
      case "building":
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#FFD700", // Gold for buildings
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        };
      case "billboard":
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#FF6347", // Tomato for billboards
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        };
      case "human":
      default:
        return {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#00FFFF", // Cyan for human/default
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        };
    }
  };

  return (
    <Marker
      key={pin.id}
      position={{ lat: pin.lat, lng: pin.lng }}
      title={pin.title}
      onClick={() => onPinSelect(pin)}
      icon={getMarkerStyle()}
    />
  );
};
