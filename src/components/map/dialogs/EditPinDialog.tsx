
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaglineInput } from "./TaglineInput";
import { ImageSelector } from "./ImageSelector";
import { DialogActions } from "./DialogActions";
import { usePhillboardEdit } from "./hooks/usePhillboardEdit";
import { MapPin } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/components/stats/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { useState } from "react";

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
  const [error, setError] = useState<string | null>(null);
  
  const {
    tagline,
    setTagline,
    selectedImage,
    setSelectedImage,
    isSubmitting,
    handleUpdatePhillboard,
    editCost,
    editCount
  } = usePhillboardEdit({ 
    phillboard: selectedPin,
    onClose: () => {
      setError(null);
      onOpenChange(false);
    },
    onUpdatePin,
    onError: (errorMsg) => setError(errorMsg)
  });
  
  const handleCloseDialog = () => {
    setError(null);
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
          
          {editCost !== null && (
            <Alert className="bg-black/40 border-white/10">
              <Info className="h-4 w-4 text-cyan-400" />
              <AlertDescription>
                Cost to edit: <span className="text-cyan-400 font-bold">{formatCurrency(editCost)}</span>
                <p className="text-xs text-gray-400 mt-1">
                  This phillboard has been edited {editCount} time(s)
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="bg-black/40 border-red-500/50">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}
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
