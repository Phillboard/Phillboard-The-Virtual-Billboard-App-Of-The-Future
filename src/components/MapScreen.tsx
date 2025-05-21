import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// We'll keep the fake data as fallback
const defaultMapPins = [
  { id: 1, lat: 47.5, lng: 52.2, title: "Downtown Digital", username: "CyberAlex", distance: "120 ft" },
  { id: 2, lat: 47.7, lng: 51.9, title: "Tech Hub", username: "NeonRider", distance: "250 ft" },
  { id: 3, lat: 47.2, lng: 52.4, title: "Future Now", username: "DigitalNomad", distance: "85 ft" },
];

interface UserLocation {
  lat: number;
  lng: number;
}

export function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [tagline, setTagline] = useState("");
  const [selectedImage, setSelectedImage] = useState("1");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapPins, setMapPins] = useState(defaultMapPins);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user's geolocation
  useEffect(() => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Recalculate map pins relative to the user's location
        // For demonstration, we'll offset the default pins to be near the user's location
        const newPins = defaultMapPins.map((pin, idx) => ({
          ...pin,
          lat: latitude + (idx * 0.001 - 0.001),
          lng: longitude + (idx * 0.001 - 0.001),
          // Calculate approximate distance in feet (very rough approximation)
          distance: `${Math.round(idx * 100 + 50)} ft`
        }));
        
        setMapPins(newPins);
        setIsLoading(false);
        toast.success("Location found successfully");
      },
      (error) => {
        console.error("Error getting location:", error);
        setError(`Error getting your location: ${error.message}`);
        setIsLoading(false);
        toast.error(`Failed to get your location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);
  
  const handlePinSelect = (pin: any) => {
    setSelectedPin(pin);
  };
  
  const handleViewInAR = () => {
    toast.success(`Launching AR view for "${selectedPin.title}"`);
    setSelectedPin(null);
  };
  
  const handleOverwrite = () => {
    toast.info("Overwrite feature coming soon!");
    setSelectedPin(null);
  };
  
  const handleCreatePhillboard = () => {
    if (!tagline) {
      toast.error("Please enter a tagline for your phillboard");
      return;
    }
    
    if (!userLocation) {
      toast.error("Cannot place phillboard without location data");
      return;
    }
    
    // Create a new phillboard at user's current location
    const newPin = {
      id: mapPins.length + 1,
      lat: userLocation.lat,
      lng: userLocation.lng,
      title: tagline,
      username: "You",
      distance: "0 ft"
    };
    
    setMapPins([...mapPins, newPin]);
    toast.success("Phillboard created successfully!");
    setIsPlaceDialogOpen(false);
    setTagline("");
    setSelectedImage("1");
  };
  
  const handleCloseDialog = () => {
    setIsPlaceDialogOpen(false);
    setTagline("");
    setSelectedImage("1");
  };
  
  return (
    <div className="screen relative">
      {/* Map background (placeholder for a real map) */}
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
              onClick={() => handlePinSelect(pin)}
            >
              <div className="w-3 h-3 bg-neon-cyan rounded-full animate-glow"></div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-neon-cyan rounded-full opacity-30 animate-pulse"></div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Top bar with location info */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-2 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-sm">
            {isLoading 
              ? "Finding your location..." 
              : userLocation 
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
                : "Location unavailable"}
          </span>
        </div>
        <div className="text-neon-cyan text-sm">{mapPins.length} phillboards nearby</div>
      </div>
      
      {/* Pin popup dialog */}
      {selectedPin && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-20 animate-fade-in">
          <Card className="neon-card">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPin.title}</h3>
                  <p className="text-sm text-gray-400">by @{selectedPin.username}</p>
                </div>
                <div className="flex items-center text-sm text-neon-cyan">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {selectedPin.distance}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-md h-32 mb-4 flex items-center justify-center">
                <div className="text-neon-cyan text-4xl">Aa</div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
                  onClick={handleViewInAR}
                >
                  View in AR
                </Button>
                <Button 
                  className="flex-1 bg-neon-magenta/20 hover:bg-neon-magenta/30 text-white border border-neon-magenta"
                  onClick={handleOverwrite}
                  disabled
                >
                  Overwrite
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-sm"
                onClick={() => setSelectedPin(null)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* FAB for creating a new phillboard */}
      <button 
        className="fixed right-6 bottom-24 w-14 h-14 bg-neon-cyan text-black rounded-full flex items-center justify-center shadow-neon-cyan z-20"
        onClick={() => setIsPlaceDialogOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/>
          <path d="M12 5v14"/>
        </svg>
      </button>
      
      {/* Create phillboard dialog */}
      <Dialog open={isPlaceDialogOpen} onOpenChange={setIsPlaceDialogOpen}>
        <DialogContent className="sm:max-w-md bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle>Place a Phillboard</DialogTitle>
            <DialogDescription>
              Create a new phillboard at your current location
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline (max 30 chars)</Label>
              <Input
                id="tagline"
                placeholder="Enter a catchy tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 30))}
                maxLength={30}
                className="bg-black/40 border-white/20"
              />
              <div className="text-right text-xs text-gray-400">
                {tagline.length}/30
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Select an image</Label>
              <RadioGroup value={selectedImage} onValueChange={setSelectedImage} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem 
                    value="1" 
                    id="image1" 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="image1"
                    className="flex flex-col items-center justify-center h-24 rounded-md border-2 border-white/20 bg-black/40 p-2 hover:bg-black/60 hover:border-neon-cyan peer-data-[state=checked]:border-neon-cyan peer-data-[state=checked]:bg-neon-cyan/10"
                  >
                    <div className="text-2xl">Aa</div>
                    <span className="text-xs mt-1">Text</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="2" 
                    id="image2" 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="image2"
                    className="flex flex-col items-center justify-center h-24 rounded-md border-2 border-white/20 bg-black/40 p-2 hover:bg-black/60 hover:border-neon-cyan peer-data-[state=checked]:border-neon-cyan peer-data-[state=checked]:bg-neon-cyan/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <span className="text-xs mt-1">Image</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="3" 
                    id="image3" 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="image3"
                    className="flex flex-col items-center justify-center h-24 rounded-md border-2 border-white/20 bg-black/40 p-2 hover:bg-black/60 hover:border-neon-cyan peer-data-[state=checked]:border-neon-cyan peer-data-[state=checked]:bg-neon-cyan/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <path d="M12 18v-6"/>
                      <path d="M8 18v-1"/>
                      <path d="M16 18v-3"/>
                    </svg>
                    <span className="text-xs mt-1">Custom</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={handleCloseDialog}
              className="bg-transparent border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePhillboard}
              className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
            >
              Post Phillboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
