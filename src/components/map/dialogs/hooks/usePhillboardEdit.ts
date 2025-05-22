
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MapPin } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Map selected image to placement type
const getPlacementType = (imageSelection: string) => {
  switch (imageSelection) {
    case "1": return "human";
    case "2": return "building";
    case "3": return "billboard";
    default: return "human";
  }
};

// Calculate cost of editing a phillboard
const calculateEditCost = async (phillboardId: string | number, userId: string) => {
  try {
    // Get the edit count for this phillboard (each edit doubles the cost)
    const { data: editHistory, error } = await supabase
      .from("phillboards")
      .select("created_at")
      .eq("id", String(phillboardId))
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    
    // Base cost is $1, double for each previous edit
    const editCount = editHistory ? editHistory.length : 0;
    return Math.pow(2, editCount);
  } catch (err) {
    console.error("Error calculating edit cost:", err);
    return 1; // Default to $1
  }
};

// Process payment for editing a phillboard
const processEditPayment = async (
  editCost: number, 
  userId: string, 
  phillboardId: string | number
) => {
  // Get user's current balance
  const { data: userBalance, error: balanceError } = await supabase
    .from('user_balances')
    .select('balance')
    .eq('id', userId)
    .single();
    
  if (balanceError) {
    console.error("Error getting user balance:", balanceError);
    throw new Error("Failed to check your balance. Please try again.");
  }
  
  // Check if user has enough balance
  if (!userBalance || userBalance.balance < editCost) {
    throw new Error(`Insufficient funds. You need $${editCost.toFixed(2)} to edit this phillboard.`);
  }
  
  // Update user's balance (deduct the cost)
  const { error: updateError } = await supabase
    .from('user_balances')
    .update({ 
      balance: userBalance.balance - editCost,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error("Error updating balance:", updateError);
    throw new Error("Payment processing error. Please try again.");
  }
  
  // Get the original creator from the database
  const { data: originalPhillboard, error: phillboardError } = await supabase
    .from("phillboards")
    .select("user_id")
    .eq("id", String(phillboardId))
    .single();
    
  if (phillboardError) {
    console.error("Error getting original creator:", phillboardError);
    throw new Error("Failed to get phillboard details.");
  }
  
  return {
    success: true,
    originalCreatorId: originalPhillboard?.user_id,
    message: `Edited phillboard for $${editCost.toFixed(2)}`
  };
};

// Pay the original creator their share
const payOriginalCreator = async (originalCreatorId: string, userId: string, editCost: number) => {
  if (!originalCreatorId || originalCreatorId === userId) {
    console.log("No original creator to pay or creator is current user");
    return { success: true };
  }
  
  const creatorShare = editCost * 0.5;
  
  try {
    console.log(`Paying original creator ${originalCreatorId} share of $${creatorShare}`);
    
    const { data, error: creatorUpdateError } = await supabase
      .rpc('add_to_balance', { 
        user_id: originalCreatorId, 
        amount: creatorShare 
      });
      
    if (creatorUpdateError) {
      console.error("Error paying original creator:", creatorUpdateError);
      toast.error("Failed to pay original creator, but your edit was successful.");
      return { success: false, error: creatorUpdateError };
    } else {
      console.log("Original creator payment successful:", data);
      toast.info(`The original creator earned $${creatorShare.toFixed(2)} from your edit.`);
      return { success: true };
    }
  } catch (err) {
    console.error("Exception when paying creator:", err);
    toast.error("Failed to pay original creator, but your edit was successful.");
    return { success: false, error: err };
  }
};

// Update phillboard in the database
const updatePhillboardInDatabase = async (
  phillboardId: string | number,
  updates: {
    title: string;
    image_type: string;
    placement_type: string;
  }
) => {
  const idString = typeof phillboardId === 'number' ? String(phillboardId) : phillboardId;
  
  console.log(`Updating phillboard ${idString} with:`, updates);
  
  try {
    const { data, error } = await supabase
      .from("phillboards")
      .update(updates)
      .eq("id", idString)
      .select()
      .single();

    if (error) {
      console.error("Error updating phillboard:", error);
      throw new Error(`Failed to update phillboard: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Failed to retrieve updated phillboard");
    }
    
    console.log("Phillboard update successful:", data);
    return data;
  } catch (error) {
    console.error("Exception updating phillboard:", error);
    throw error;
  }
};

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
  
  // Calculate the cost of editing this phillboard
  useEffect(() => {
    const fetchEditCost = async () => {
      if (!user) return;
      const cost = await calculateEditCost(phillboard.id, user.id);
      setEditCost(cost);
    };
    
    fetchEditCost();
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
      
      // Process payment first
      if (editCost && editCost > 0) {
        try {
          const paymentResult = await processEditPayment(editCost, user.id, phillboard.id);
          toast.success(paymentResult.message);
          
          // Pay the original creator if applicable
          if (paymentResult.originalCreatorId) {
            await payOriginalCreator(paymentResult.originalCreatorId, user.id, editCost);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Payment processing error. Please try again.");
          }
          setIsSubmitting(false);
          return;
        }
      }
      
      // Then update the phillboard
      try {
        const updatedPhillboardData = await updatePhillboardInDatabase(phillboard.id, updates);
        
        // Create the updated visual pin for the map
        const updatedPin: MapPin = {
          ...phillboard,
          ...updatedPhillboardData
        };

        onUpdatePin(updatedPin);
        toast.success("Phillboard updated successfully!");
        onClose();
      } catch (error) {
        console.error("Failed to update phillboard:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update phillboard. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error in handleUpdatePhillboard:", error);
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
    editCost
  };
}
