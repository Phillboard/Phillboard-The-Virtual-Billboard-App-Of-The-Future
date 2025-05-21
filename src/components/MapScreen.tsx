
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// Fake data for map pins
const mapPins = [
  { id: 1, lat: 47.5, lng: 52.2, title: "Downtown Digital", username: "CyberAlex", distance: "120 ft" },
  { id: 2, lat: 47.7, lng: 51.9, title: "Tech Hub", username: "NeonRider", distance: "250 ft" },
  { id: 3, lat: 47.2, lng: 52.4, title: "Future Now", username: "DigitalNomad", distance: "85 ft" },
];

export function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [tagline, setTagline] = useState("");
  const [selectedImage, setSelectedImage] = useState("1");
  
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
          
          {/* Map pins */}
          {mapPins.map((pin) => (
            <button
              key={pin.id}
              className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                top: `${(pin.lat / 100) * 100}%`,
                left: `${(pin.lng / 100) * 100}%`,
              }}
              onClick={() => handlePinSelect(pin)}
            >
              <div className="w-3 h-3 bg-neon-cyan rounded-full animate-glow"></div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-neon-cyan rounded-full opacity-30 animate-pulse"></div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Top bar with mock location info */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-2 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-sm">Downtown, Metro City</span>
        </div>
        <div className="text-neon-cyan text-sm">3 phillboards nearby</div>
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
