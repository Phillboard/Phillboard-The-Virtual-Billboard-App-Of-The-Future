
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaglineInput } from "./TaglineInput";
import { ImageSelector } from "./ImageSelector";
import { DialogActions } from "./DialogActions";
import { usePhillboardEdit } from "./hooks/usePhillboardEdit";
import { MapPin } from "../types";
import { useAuth } from "@/contexts/AuthContext";

interface EditPinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPin: MapPin;
  onUpdatePin: (updatedPin: MapPin) => void;
}

export function EditPinDialog({ 
  isOpen, 
  onOpenChange, 
  selectedPin,
  onUpdatePin
}: EditPinDialogProps) {
  const { user } = useAuth();
  
  const {
    tagline,
    setTagline,
    selectedImage,
    setSelectedImage,
    isSubmitting,
    handleUpdatePhillboard
  } = usePhillboardEdit({ 
    phillboard: selectedPin,
    onClose: () => onOpenChange(false),
    onUpdatePin
  });
  
  const handleCloseDialog = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Phillboard</DialogTitle>
          <DialogDescription>
            Update your phillboard details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <TaglineInput tagline={tagline} setTagline={setTagline} />
          <ImageSelector selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        </div>
        
        <DialogActions 
          onCancel={handleCloseDialog}
          onSubmit={handleUpdatePhillboard}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
