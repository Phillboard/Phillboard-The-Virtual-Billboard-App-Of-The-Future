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
  Info,
} from "lucide-react";
import { EditPinDialog } from "./dialogs/EditPinDialog";
import { DeletePinDialog } from "./dialogs/DeletePinDialog";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin as MapPinType } from "./types";
import { useState as useReactState } from "react";
import { UserProfileDialog } from "../profile/UserProfileDialog";
import { calculateEditCost, getEditCount } from "@/services/phillboardService";
import { useEffect } from "react";
import { formatCurrency } from "@/components/stats/utils";

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
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editCost, setEditCost] = useState<number | null>(null);
  const [editCount, setEditCount] = useState<number>(0);
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    // Fetch edit cost and count when a pin is selected
    const fetchEditData = async () => {
      if (!selectedPin || !user) return;
      
      try {
        // Get edit count
        const count = await getEditCount(selectedPin.id);
        setEditCount(count);
        
        // Calculate cost based on count
        const cost = await calculateEditCost(selectedPin.id, user.id);
        setEditCost(cost);
      } catch (error) {
        console.error("Failed to fetch edit data:", error);
      }
    };
    
    fetchEditData();
  }, [selectedPin, user]);
  
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
            Placed by{" "}
            <button 
              className="text-fuchsia-500 hover:underline focus:outline-none"
              onClick={() => setIsProfileDialogOpen(true)}
            >
              @{selectedPin.username}
            </button>
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
          
          {user && editCost !== null && (
            <div className="mt-2 p-3 bg-gray-900/50 rounded-md">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Info size={14} className="text-cyan-400" />
                <span>Edit cost: <span className="text-cyan-400 font-medium">{formatCurrency(editCost)}</span></span>
              </div>
              <p className="text-xs text-gray-400 mt-1 pl-5">
                This phillboard has been edited {editCount} time(s)
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
      
      <UserProfileDialog
        isOpen={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        username={selectedPin.username}
      />
    </Dialog>
  );
}
