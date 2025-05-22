
import { useState, useEffect } from "react";
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
  const [editCost, setEditCost] = useState<number | null>(null);
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
  
  // Calculate the cost of editing this phillboard
  useEffect(() => {
    const calculateEditCost = async () => {
      if (!user) return;
      
      try {
        // Get the edit count for this phillboard (each edit doubles the cost)
        const { data: editHistory, error } = await supabase
          .from("phillboards")
          .select("created_at")
          .eq("id", String(phillboard.id))
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Base cost is $1, double for each previous edit
        const editCount = editHistory ? editHistory.length : 0;
        const cost = Math.pow(2, editCount);
        setEditCost(cost);
      } catch (err) {
        console.error("Error calculating edit cost:", err);
        setEditCost(1); // Default to $1
      }
    };
    
    calculateEditCost();
  }, [phillboard.id, user]);

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
      
      // Process payment for editing
      if (editCost && editCost > 0) {
        // Get user's current balance
        const { data: userBalance, error: balanceError } = await supabase
          .from('user_balances')
          .select('balance')
          .eq('id', session.user.id)
          .single();
          
        if (balanceError) {
          console.error("Error getting user balance:", balanceError);
          toast.error("Failed to check your balance. Please try again.");
          setIsSubmitting(false);
          return;
        }
        
        // Check if user has enough balance
        if (!userBalance || userBalance.balance < editCost) {
          toast.error(`Insufficient funds. You need $${editCost.toFixed(2)} to edit this phillboard.`);
          setIsSubmitting(false);
          return;
        }
        
        // First, get the original creator from the database
        const { data: originalPhillboard, error: phillboardError } = await supabase
          .from("phillboards")
          .select("user_id")
          .eq("id", String(phillboard.id))
          .single();
          
        if (phillboardError) {
          console.error("Error getting original creator:", phillboardError);
          toast.error("Failed to get phillboard details. Please try again.");
          setIsSubmitting(false);
          return;
        }
        
        // Update user's balance (deduct the cost)
        const { error: updateError } = await supabase
          .from('user_balances')
          .update({ 
            balance: userBalance.balance - editCost,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
          
        if (updateError) {
          console.error("Error updating balance:", updateError);
          toast.error("Payment processing error. Please try again.");
          setIsSubmitting(false);
          return;
        }
        
        // Let the user know the cost
        toast.success(`Edited phillboard for $${editCost.toFixed(2)}`);
        
        // If the user is not the original creator, give them 50% of the edit cost
        if (originalPhillboard && 
            originalPhillboard.user_id && 
            originalPhillboard.user_id !== session.user.id) {
          const creatorShare = editCost * 0.5;
          
          try {
            const { data, error: creatorUpdateError } = await supabase
              .rpc('add_to_balance', { 
                user_id: originalPhillboard.user_id, 
                amount: creatorShare 
              });
              
            if (creatorUpdateError) {
              console.error("Error paying original creator:", creatorUpdateError);
              toast.error("Failed to pay original creator, but your edit was successful.");
            } else {
              console.log("Original creator payment successful:", data);
              toast.info(`The original creator earned $${creatorShare.toFixed(2)} from your edit.`);
            }
          } catch (err) {
            console.error("Exception when paying creator:", err);
            // Continue anyway since the edit is still valid
            toast.error("Failed to pay original creator, but your edit was successful.");
          }
        }
      }

      // Get placement type from selected image
      const placementType = getPlacementType(selectedImage);

      // Update the phillboard in the database
      // Convert id to string if it's a number to ensure compatibility with supabase
      const phillboardId = typeof phillboard.id === 'number' ? String(phillboard.id) : phillboard.id;
      
      const { data, error } = await supabase
        .from("phillboards")
        .update({
          title: tagline,
          image_type: `image-${selectedImage}`,
          placement_type: placementType,
        })
        .eq("id", phillboardId)
        .select();

      if (error) {
        console.error("Error updating phillboard:", error);
        toast.error("Failed to update phillboard. You may not have permission to edit this phillboard.");
        setIsSubmitting(false);
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Failed to update phillboard");
        setIsSubmitting(false);
        return;
      }

      // Create the updated visual pin for the map
      const updatedPin: MapPin = {
        ...phillboard,
        title: tagline,
        image_type: `image-${selectedImage}`,
        placement_type: placementType,
      };

      onUpdatePin(updatedPin);
      toast.success("Phillboard updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating phillboard:", error);
      toast.error("Failed to update phillboard. Please try again.");
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
    editCost
  };
}
