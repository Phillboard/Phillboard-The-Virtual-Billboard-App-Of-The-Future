
import { useState } from "react";
import { toast } from "sonner";
import { MapPin } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  const handleUpdatePhillboard = async () => {
    if (!tagline) {
      toast.error("Please enter a tagline for your phillboard");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("You must be logged in to edit a phillboard");
        setIsSubmitting(false);
        return;
      }

      // Update the phillboard in the database
      const { data, error } = await supabase
        .from("phillboards")
        .update({
          title: tagline,
          image_type: `image-${selectedImage}`,
        })
        .eq("id", phillboard.id)
        .select();

      if (error) {
        console.error("Error updating phillboard:", error);
        toast.error("Failed to update phillboard. You may not have permission to edit this phillboard.");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Failed to update phillboard");
        return;
      }

      // Create the updated visual pin for the map
      const updatedPin: MapPin = {
        ...phillboard,
        title: tagline,
        image_type: `image-${selectedImage}`,
      };

      onUpdatePin(updatedPin);
      toast.success("Phillboard updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating phillboard:", error);
      toast.error("Failed to update phillboard. Please try again.");
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
  };
}
