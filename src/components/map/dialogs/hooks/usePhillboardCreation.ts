
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, UserLocation } from "../../types";
import { createPhillboard } from "@/services/phillboardService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      const username = user?.email?.split('@')[0] || "Anonymous";
      
      // Create the phillboard in the database
      const newPhillboardData = {
        title: tagline,
        username: username,
        lat: locationToUse.lat,
        lng: locationToUse.lng,
        image_type: `image-${selectedImage}`,
        content: null
      };
      
      if (session?.user?.id) {
        newPhillboardData['user_id'] = session.user.id;
      }
      
      const newPhillboard = await createPhillboard(newPhillboardData);
      
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
      
      if (!session?.user) {
        toast.info("Created phillboard locally (offline mode)");
      } else {
        toast.success("Phillboard created successfully!");
      }
      
    } catch (error) {
      console.error("Error creating phillboard:", error);
      
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
