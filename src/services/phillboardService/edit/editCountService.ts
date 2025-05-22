
import { supabase } from "@/integrations/supabase/client";
import { handleServiceError } from "./errorHandling";

/**
 * Get the edit count for a phillboard
 */
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

/**
 * Calculate cost of editing a phillboard
 */
export const calculateEditCost = async (phillboardId: string | number, userId: string) => {
  try {
    // Get the edit count for this phillboard
    const editCount = await getEditCount(phillboardId);
    
    // Base cost is $1, double for each previous edit
    const cost = Math.pow(2, editCount);
    
    console.log(`Edit cost for phillboard ${phillboardId}: $${cost} (${editCount} previous edits)`);
    return cost;
  } catch (err) {
    throw handleServiceError(err, "Failed to calculate edit cost");
  }
};

/**
 * Record this edit in phillboards_edit_history
 */
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
