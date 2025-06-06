
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MapPin } from "../../types";
import { useAuth } from "@/contexts/AuthContext";
import { 
  editPhillboard, 
  getPlacementType, 
  calculateEditCost,
  getEditCount 
} from "@/services/phillboardService";

export function usePhillboardEdit({
  phillboard,
  onClose,
  onUpdatePin,
  onError
}: {
  phillboard: MapPin;
  onClose: () => void;
  onUpdatePin: (updatedPin: MapPin) => void;
  onError?: (error: string) => void;
}) {
  const [tagline, setTagline] = useState(phillboard.title);
  const [selectedImage, setSelectedImage] = useState(
    phillboard.image_type?.split("-")[1] || "1"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCost, setEditCost] = useState<number | null>(null);
  const [editCount, setEditCount] = useState<number>(0);
  const { user } = useAuth();
  
  // Reset form data when phillboard changes
  useEffect(() => {
    setTagline(phillboard.title);
    setSelectedImage(phillboard.image_type?.split("-")[1] || "1");
    setEditCost(null);
    setEditCount(0);
  }, [phillboard.id, phillboard.title, phillboard.image_type]);
  
  // Calculate the cost of editing this phillboard and get edit count
  useEffect(() => {
    const fetchEditData = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching edit data for phillboard:", phillboard.id);
        
        // Get edit count
        const count = await getEditCount(phillboard.id);
        console.log("Edit count:", count);
        setEditCount(count);
        
        // Calculate cost based on count
        const cost = await calculateEditCost(phillboard.id, user.id);
        console.log("Edit cost:", cost);
        setEditCost(cost);
      } catch (error) {
        console.error("Failed to calculate edit cost:", error);
        toast.error("Failed to calculate edit cost. Please try again.");
      }
    };
    
    fetchEditData();
  }, [phillboard.id, user]);

  const handleUpdatePhillboard = async () => {
    if (!tagline) {
      const errorMsg = "Please enter a tagline for your phillboard";
      if (onError) onError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!user) {
        const errorMsg = "You must be logged in to edit a phillboard";
        if (onError) onError(errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      // Get placement type from selected image
      const placementType = getPlacementType(selectedImage);
      const updates = {
        title: tagline,
        image_type: `image-${selectedImage}`,
        placement_type: placementType,
      };
      
      console.log("Sending phillboard update with:", updates);
      
      // Process the edit using our service function
      const result = await editPhillboard(phillboard.id, user.id, updates);
      
      if (!result.success) {
        console.error("Edit failed with result:", result);
        const errorMsg = result.message || "Failed to edit phillboard";
        if (onError) onError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Create the updated visual pin for the map
      const updatedPin: MapPin = {
        ...phillboard,
        ...updates
      };

      onUpdatePin(updatedPin);
      toast.success("Phillboard updated successfully!");
      onClose();
      
    } catch (error) {
      console.error("Error in handleUpdatePhillboard:", error);
      if (error instanceof Error) {
        if (onError) onError(error.message);
        toast.error(error.message);
      } else {
        if (onError) onError("Failed to update phillboard. Please try again.");
        toast.error("Failed to update phillboard. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tagline,
    setTagline,
    selectedImage,
    setSelectedImage,
    isSubmitting,
    handleUpdatePhillboard,
    editCost,
    editCount
  };
}
