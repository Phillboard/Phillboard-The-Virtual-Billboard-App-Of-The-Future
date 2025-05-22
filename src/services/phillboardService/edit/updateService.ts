
import { supabase } from "@/integrations/supabase/client";
import { PhillboardUpdateData } from "./types";

/**
 * Update phillboard in the database
 */
export const updatePhillboardInDatabase = async (
  phillboardId: string | number,
  updates: PhillboardUpdateData
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
