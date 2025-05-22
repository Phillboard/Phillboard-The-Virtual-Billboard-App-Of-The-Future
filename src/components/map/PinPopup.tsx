import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  Pencil,
  Trash,
  User,
  Home,
  MonitorPlay,
} from "lucide-react";
import { EditPinDialog } from "./dialogs/EditPinDialog";
import { DeletePinDialog } from "./dialogs/DeletePinDialog";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin as MapPinType } from "./types";

interface PinPopupProps {
  selectedPin: MapPinType | null;
  onClose: () => void;
  onPinDelete: () => void;
  onPinUpdate: (updatedPin: MapPinType) => void;
}

export function PinPopup({ 
  selectedPin, 
  onClose,
  onPinDelete,
  onPinUpdate
}: PinPopupProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  
  if (!selectedPin) return null;
  
  const formattedDate = selectedPin.created_at 
    ? format(new Date(selectedPin.created_at), "MMM d, yyyy 'at' h:mm a") 
    : "Unknown date";
  
  const canEdit = user && (user.email?.split('@')[0] === selectedPin.username || isAdmin(user));
  
  const getPlacementTypeLabel = (type?: string) => {
    switch (type) {
      case "human": return "Above human/object";
      case "building": return "Above building";
      case "billboard": return "Billboard size";
      default: return "Standard placement";
    }
  };

  const getPlacementIcon = (type?: string) => {
    switch (type) {
      case "human": return <User size={14} />;
      case "building": return <Home size={14} />;
      case "billboard": return <MonitorPlay size={14} />;
      default: return <MapPin size={14} />;
    }
  };
  
  return (
    <Dialog open={!!selectedPin} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">{selectedPin.title}</DialogTitle>
          <DialogDescription>
            Placed by <span className="text-fuchsia-500">@{selectedPin.username}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={14} />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin size={14} />
            <span>{selectedPin.distance} away</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {getPlacementIcon(selectedPin.placement_type)}
            <span>{getPlacementTypeLabel(selectedPin.placement_type)}</span>
          </div>
          
          {selectedPin.content && (
            <div className="mt-2 p-3 bg-gray-900/50 rounded-md">
              <p className="text-sm italic text-gray-300">
                "{selectedPin.content}"
              </p>
            </div>
          )}
        </div>
        
        {canEdit && (
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil size={16} className="mr-1" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        )}
      </DialogContent>
      
      <EditPinDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedPin={selectedPin}
        onUpdatePin={onPinUpdate}
      />
      
      <DeletePinDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedPin={selectedPin}
        onDeleteSuccess={onPinDelete}
      />
    </Dialog>
  );
}
