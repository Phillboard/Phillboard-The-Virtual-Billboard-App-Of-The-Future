
import { supabase } from "@/integrations/supabase/client";
import { PhillboardUpdateData } from "./types";
import { handleServiceError } from "./errorHandling";

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
    // First verify the phillboard exists before attempting to update
    const { data: existingPhillboard, error: checkError } = await supabase
      .from("phillboards")
      .select("id")
      .eq("id", idString)
      .single();

    if (checkError || !existingPhillboard) {
      console.error("Phillboard not found:", checkError);
      throw handleServiceError(checkError || new Error("Phillboard not found"), "Phillboard not found or inaccessible");
    }
    
    // Perform the update but don't use single() here to avoid errors
    const { data, error } = await supabase
      .from("phillboards")
      .update(updates)
      .eq("id", idString)
      .select();

    if (error) {
      console.error("Database update error:", error);
      throw handleServiceError(error, `Failed to update phillboard`);
    }
    
    if (!data || data.length === 0) {
      console.error("Update returned no data");
      throw new Error("Failed to retrieve updated phillboard");
    }
    
    console.log("Phillboard update successful:", data[0]);
    return data[0]; // Return the first item in the array
  } catch (error) {
    console.error("Exception in updatePhillboardInDatabase:", error);
    throw handleServiceError(error, "Exception updating phillboard");
  }
};
