
import { Marker } from "@react-google-maps/api";
import { MapPin } from "../types";

interface MapPinMarkerProps {
  pin: MapPin;
  onPinSelect: (pin: MapPin) => void;
}

export const MapPinMarker = ({ pin, onPinSelect }: MapPinMarkerProps) => {
  return (
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
  );
};
