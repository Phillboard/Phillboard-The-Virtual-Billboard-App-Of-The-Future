
import { ReactNode } from "react";
import { UserLocation, MapPin } from "./types";

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
        {/* Grid lines to simulate a map */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center',
        }}></div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-neon-cyan flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin mb-2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-sm">Finding your location...</span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
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
        
        {/* User location marker (blue dot) */}
        {userLocation && (
          <div 
            className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              top: '50%',
              left: '50%',
            }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse">
              <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
            </div>
          </div>
        )}
        
        {/* Map pins */}
        {mapPins.map((pin) => (
          <button
            key={pin.id}
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              // Position pins relative to the center (user location)
              top: `${userLocation ? 50 + ((pin.lat - (userLocation?.lat || 0)) * 1000) : (pin.lat / 100) * 100}%`,
              left: `${userLocation ? 50 + ((pin.lng - (userLocation?.lng || 0)) * 1000) : (pin.lng / 100) * 100}%`,
            }}
            onClick={() => onPinSelect(pin)}
          >
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-glow"></div>
            <div className="absolute top-0 left-0 w-6 h-6 bg-neon-cyan rounded-full opacity-30 animate-pulse"></div>
          </button>
        ))}
        
        {children}
      </div>
    </div>
  );
}
