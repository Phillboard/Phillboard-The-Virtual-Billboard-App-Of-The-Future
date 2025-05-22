
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
        .eq('id', selectedPin.id);
      
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
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : "Delete Phillboard"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
