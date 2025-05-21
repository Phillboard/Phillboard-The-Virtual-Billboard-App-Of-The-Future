
import { ReactNode } from "react";
import { UserLocation, MapPin } from "./types";
import { GoogleMapComponent } from "./GoogleMapComponent";

interface MapBackgroundProps {
  isLoading: boolean;
  error: string | null;
  userLocation: UserLocation | null;
  mapPins: MapPin[];
  onPinSelect: (pin: MapPin) => void;
  children?: ReactNode;
}

export function MapBackground({ 
  isLoading, 
  error, 
  userLocation, 
  mapPins, 
  onPinSelect,
  children 
}: MapBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="w-full h-full bg-gray-900 opacity-90 relative">
        {/* Google Map Component */}
        <GoogleMapComponent
          userLocation={userLocation}
          mapPins={mapPins}
          onPinSelect={onPinSelect}
          isLoading={isLoading}
        />
        
        {/* Error message */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black/60 p-4 rounded-md text-red-400 max-w-xs text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
              {error}
              <p className="text-xs mt-2">Using demo data instead</p>
            </div>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}
