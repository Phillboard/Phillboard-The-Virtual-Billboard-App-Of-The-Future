
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaglineInput } from "./TaglineInput";
import { ImageSelector } from "./ImageSelector";
import { AdminLocationInfo } from "./AdminLocationInfo";
import { DialogActions } from "./DialogActions";
import { usePhillboardCreation } from "./hooks/usePhillboardCreation";
import { UserLocation, MapPin } from "../types";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation: UserLocation | null;
  onCreatePin: (pin: MapPin) => void;
  isAdminMode?: boolean;
  selectedLocation?: UserLocation | null;
}

export function CreatePinDialog({ 
  isOpen, 
  onOpenChange, 
  userLocation, 
  onCreatePin,
  isAdminMode = false,
  selectedLocation = null
}: CreatePinDialogProps) {
  const locationToUse = selectedLocation || userLocation;
  const isCustomLocation = !!selectedLocation;
  const { user } = useAuth();
  
  const {
    tagline,
    setTagline,
    selectedImage,
    setSelectedImage,
    isSubmitting,
    handleCreatePhillboard,
    estimatedCost
  } = usePhillboardCreation({ 
    onCreatePin, 
    onClose: () => onOpenChange(false)
  });
  
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
            {isCustomLocation && isAdminMode 
              ? "Place a phillboard at the selected location (Admin Mode)" 
              : "Create a new phillboard at your current location"}
          </DialogDescription>
        </DialogHeader>
        
        <AdminLocationInfo 
          isCustomLocation={isCustomLocation}
          isAdminMode={isAdminMode}
          locationToUse={locationToUse}
        />
        
        <div className="space-y-4 py-4">
          <TaglineInput tagline={tagline} setTagline={setTagline} />
          <ImageSelector selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
          
          {user && estimatedCost !== null && (
            <div className="px-1 py-2">
              <p className="text-sm text-gray-400">Estimated cost: 
                <span className="ml-2 font-medium text-neon-cyan">${estimatedCost.toFixed(2)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cost increases if this location already has phillboards.
              </p>
            </div>
          )}
        </div>
        
        <DialogActions 
          onCancel={handleCloseDialog}
          onSubmit={() => handleCreatePhillboard(locationToUse)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
