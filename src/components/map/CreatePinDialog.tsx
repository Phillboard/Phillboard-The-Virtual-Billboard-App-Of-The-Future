
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserLocation, MapPin } from "./types";
import { toast } from "sonner";

interface CreatePinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation: UserLocation | null;
  onCreatePin: (pin: MapPin) => void;
}

export function CreatePinDialog({ 
  isOpen, 
  onOpenChange, 
  userLocation, 
  onCreatePin 
}: CreatePinDialogProps) {
  const [tagline, setTagline] = useState("");
  const [selectedImage, setSelectedImage] = useState("1");
  
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
      id: Date.now(), // Use timestamp for unique ID
      lat: userLocation.lat,
      lng: userLocation.lng,
      title: tagline,
      username: "You",
      distance: "0 ft"
    };
    
    onCreatePin(newPin);
    toast.success("Phillboard created successfully!");
    handleCloseDialog();
  };
  
  const handleCloseDialog = () => {
    onOpenChange(false);
    setTagline("");
    setSelectedImage("1");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}
