
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";

// Map selected image to placement type
export const getPlacementType = (imageSelection: string) => {
  switch (imageSelection) {
    case "1": return "human";
    case "2": return "building";
    case "3": return "billboard";
    default: return "human";
  }
};

// Get the edit count for a phillboard
export const getEditCount = async (phillboardId: string | number) => {
  try {
    // Query for phillboard edit history
    const { data, error } = await supabase
      .rpc('get_edit_count', { 
        p_phillboard_id: String(phillboardId)
      });
      
    if (error) {
      console.error("Error getting edit count:", error);
      return 0; // Default to 0 if error
    }
    
    // Return the count of edits
    return data || 0;
  } catch (err) {
    console.error("Error getting edit count:", err);
    return 0; // Default to 0 if exception
  }
};

// Calculate cost of editing a phillboard
export const calculateEditCost = async (phillboardId: string | number, userId: string) => {
  try {
    // Get the edit count for this phillboard
    const editCount = await getEditCount(phillboardId);
    
    // Base cost is $1, double for each previous edit
    const cost = Math.pow(2, editCount);
    
    console.log(`Edit cost for phillboard ${phillboardId}: $${cost} (${editCount} previous edits)`);
    return cost;
  } catch (err) {
    console.error("Error calculating edit cost:", err);
    throw new Error("Failed to calculate edit cost");
  }
};

// Process payment for editing a phillboard
export const processEditPayment = async (
  editCost: number, 
  userId: string, 
  phillboardId: string | number
) => {
  console.log(`Processing payment of $${editCost} from user ${userId} for phillboard ${phillboardId}`);
  
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
  
  console.log(`User has sufficient balance: $${userBalance.balance}. Deducting $${editCost}`);
  
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
export const payOriginalCreator = async (originalCreatorId: string, userId: string, editCost: number) => {
  if (!originalCreatorId || originalCreatorId === userId) {
    console.log("No original creator to pay or creator is current user");
    return { success: true };
  }
  
  const creatorShare = editCost * 0.5;
  
  try {
    console.log(`Paying original creator ${originalCreatorId} share of $${creatorShare}`);
    
    // Use the add_to_balance database function to add funds safely
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

// Record this edit in phillboards_edit_history
export const recordEditHistory = async (
  phillboardId: string | number,
  userId: string,
  editCost: number
) => {
  try {
    // Use the record_edit_history database function
    const { data, error } = await supabase
      .rpc('record_edit_history', {
        p_phillboard_id: String(phillboardId),
        p_user_id: userId,
        p_cost: editCost
      });
      
    if (error) {
      console.error("Error recording edit history:", error);
      // Don't throw here, just log the error since this is non-critical
    } else {
      console.log("Edit history recorded successfully");
    }
    
    return { success: true };
  } catch (err) {
    console.error("Exception recording edit history:", err);
    // Don't throw here, just log the error since this is non-critical
    return { success: false, error: err };
  }
};

// Update phillboard in the database
export const updatePhillboardInDatabase = async (
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
    // Use select() followed by single() for proper error handling
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

// Handle the entire phillboard edit process
export const editPhillboard = async (
  phillboardId: string | number,
  userId: string,
  updates: {
    title: string;
    image_type: string;
    placement_type: string;
  }
) => {
  try {
    // Calculate the cost
    const editCost = await calculateEditCost(phillboardId, userId);
    
    // Process the payment
    const paymentResult = await processEditPayment(editCost, userId, phillboardId);
    
    // Record this edit in history
    await recordEditHistory(phillboardId, userId, editCost);
    
    // Pay the original creator if applicable
    if (paymentResult.originalCreatorId) {
      await payOriginalCreator(paymentResult.originalCreatorId, userId, editCost);
    }
    
    // Update the phillboard
    const updatedPhillboard = await updatePhillboardInDatabase(phillboardId, updates);
    
    return {
      success: true,
      data: updatedPhillboard,
      message: paymentResult.message
    };
  } catch (error) {
    // Propagate the error to be handled by the caller
    throw error;
  }
};
