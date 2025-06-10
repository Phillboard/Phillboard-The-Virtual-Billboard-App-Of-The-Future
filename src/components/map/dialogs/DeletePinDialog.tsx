
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin } from "../types";

interface DeletePinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPin: MapPin | null;
  onDeleteSuccess: () => void;
}

export function DeletePinDialog({ 
  isOpen, 
  onOpenChange, 
  selectedPin,
  onDeleteSuccess
}: DeletePinDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!selectedPin) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('phillboards')
        .delete()
        .eq('id', String(selectedPin.id));
      
      if (error) throw error;
      
      toast.success("Phillboard deleted successfully");
      onDeleteSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting phillboard:", error);
      toast.error("Failed to delete phillboard");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-black border border-red-900/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to delete the phillboard "{selectedPin?.title}"?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-transparent border border-gray-700 text-white hover:bg-gray-800"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-900/50 border border-red-500 text-white hover:bg-red-800/50"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Phillboard"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
