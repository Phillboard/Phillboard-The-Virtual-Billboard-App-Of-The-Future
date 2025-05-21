
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, UserLocation } from "../../types";
import { createPhillboard } from "@/services/phillboardService";
import { useAuth } from "@/contexts/AuthContext";

export function usePhillboardCreation({ onCreatePin, onClose }: {
  onCreatePin: (pin: MapPin) => void;
  onClose: () => void;
}) {
  const [tagline, setTagline] = useState("");
  const [selectedImage, setSelectedImage] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleCreatePhillboard = async (locationToUse: UserLocation | null) => {
    if (!tagline) {
      toast.error("Please enter a tagline for your phillboard");
      return;
    }
    
    if (!locationToUse) {
      toast.error("Cannot place phillboard without location data");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the phillboard in the database
      const newPhillboardData = {
        title: tagline,
        username: user?.email?.split('@')[0] || "Anonymous",
        lat: locationToUse.lat,
        lng: locationToUse.lng,
        image_type: `image-${selectedImage}`,
        content: null,
        user_id: user?.id // Explicitly set user_id so RLS policies can be applied correctly
      };
      
      const newPhillboard = await createPhillboard(newPhillboardData);
      
      // If the creation was successful, add the new pin to the map
      if (newPhillboard) {
        // Create the visual pin for the map with distance calculation
        const mapPin: MapPin = {
          id: newPhillboard.id,
          lat: newPhillboard.lat,
          lng: newPhillboard.lng,
          title: newPhillboard.title,
          username: newPhillboard.username,
          distance: "0 ft", // It's at the user's location
          image_type: newPhillboard.image_type,
          content: newPhillboard.content
        };
        
        onCreatePin(mapPin);
        toast.success("Phillboard created successfully!");
      } else {
        throw new Error("Failed to create phillboard - no data returned");
      }
    } catch (error) {
      console.error("Error creating phillboard:", error);
      toast.error("Failed to create phillboard. Please try again.");
      
      // Fallback to client-side creation if database insertion fails
      const fallbackPin: MapPin = {
        id: Date.now(),
        lat: locationToUse.lat,
        lng: locationToUse.lng,
        title: tagline,
        username: user?.email?.split('@')[0] || "Anonymous",
        distance: "0 ft",
        image_type: `image-${selectedImage}`,
      };
      
      onCreatePin(fallbackPin);
      toast.info("Created phillboard locally (offline mode)");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return {
    tagline,
    setTagline,
    selectedImage,
    setSelectedImage,
    isSubmitting,
    handleCreatePhillboard
  };
}
