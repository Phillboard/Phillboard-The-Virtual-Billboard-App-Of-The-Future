
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
}: {
  phillboard: MapPin;
  onClose: () => void;
  onUpdatePin: (updatedPin: MapPin) => void;
}) {
  const [tagline, setTagline] = useState(phillboard.title);
  const [selectedImage, setSelectedImage] = useState(
    phillboard.image_type?.split("-")[1] || "1"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCost, setEditCost] = useState<number | null>(null);
  const [editCount, setEditCount] = useState<number>(0);
  const { user } = useAuth();
  
  // Calculate the cost of editing this phillboard and get edit count
  useEffect(() => {
    const fetchEditData = async () => {
      if (!user) return;
      
      try {
        // Get edit count
        const count = await getEditCount(phillboard.id);
        setEditCount(count);
        
        // Calculate cost based on count
        const cost = await calculateEditCost(phillboard.id, user.id);
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
      toast.error("Please enter a tagline for your phillboard");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!user) {
        toast.error("You must be logged in to edit a phillboard");
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
      
      // Process the edit using our service function
      const result = await editPhillboard(phillboard.id, user.id, updates);
      
      // Create the updated visual pin for the map
      const updatedPin: MapPin = {
        ...phillboard,
        ...result.data
      };

      onUpdatePin(updatedPin);
      toast.success("Phillboard updated successfully!");
      onClose();
      
    } catch (error) {
      console.error("Error in handleUpdatePhillboard:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
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
