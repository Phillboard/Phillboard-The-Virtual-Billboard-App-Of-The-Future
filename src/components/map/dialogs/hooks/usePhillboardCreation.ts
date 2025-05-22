
import { useState } from "react";
import { toast } from "sonner";
import hotToast from "react-hot-toast";
import confetti from "canvas-confetti";
import { MapPin, UserLocation } from "../../types";
import { 
  createPhillboard, 
  getUserPhillboardCount, 
  getPhillboardPercentile 
} from "@/services/phillboardService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ordinal } from "@/utils/ordinal";
import successSoundUrl from "@/assets/success.mp3";

export function usePhillboardCreation({ onCreatePin, onClose }: {
  onCreatePin: (pin: MapPin) => void;
  onClose: () => void;
}) {
  const [tagline, setTagline] = useState("");
  const [selectedImage, setSelectedImage] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Function to map selected image to placement type
  const getPlacementType = (imageSelection: string) => {
    switch (imageSelection) {
      case "1": return "human";
      case "2": return "building";
      case "3": return "billboard";
      default: return "human";
    }
  };

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
      
      // Get the placement type from selected image
      const placementType = getPlacementType(selectedImage);
      
      // Create the phillboard in the database
      const newPhillboardData: any = {
        title: tagline,
        username: username,
        lat: locationToUse.lat,
        lng: locationToUse.lng,
        image_type: `image-${selectedImage}`,
        placement_type: placementType,
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
        placement_type: placementType,
        content: newPhillboard.content
      };
      
      onCreatePin(mapPin);
      
      if (session?.user) {
        // Celebrate with confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Play success sound
        try {
          new Audio(successSoundUrl).play();
        } catch (err) {
          console.error("Could not play success sound:", err);
        }
        
        // Get user stats
        const count = await getUserPhillboardCount(session.user.id);
        const percentile = await getPhillboardPercentile(session.user.id);
        
        // Show a custom toast
        hotToast.success(
          `🎉 You placed your ${ordinal(count)} Phillboard!\n` +
          `You've got more boards than ${Math.round(percentile)}% of people.`
        );
      } else {
        toast.info("Created phillboard locally (offline mode)");
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
        placement_type: getPlacementType(selectedImage),
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
