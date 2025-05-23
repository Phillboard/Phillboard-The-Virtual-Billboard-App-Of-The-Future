
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
    
    // Perform the update with explicit return option
    const { data, error } = await supabase
      .from("phillboards")
      .update(updates)
      .eq("id", idString)
      .select()
      .maybeSingle(); // Use maybeSingle() instead of relying on array handling

    if (error) {
      console.error("Database update error:", error);
      throw handleServiceError(error, `Failed to update phillboard`);
    }
    
    if (!data) {
      console.error("Update returned no data");
      // Instead of throwing an error, fetch the updated record
      const { data: fetchedData, error: fetchError } = await supabase
        .from("phillboards")
        .select()
        .eq("id", idString)
        .single();
        
      if (fetchError || !fetchedData) {
        throw handleServiceError(
          fetchError || new Error("Failed to retrieve updated phillboard"), 
          "Could not verify phillboard update"
        );
      }
      
      console.log("Retrieved phillboard after update:", fetchedData);
      return fetchedData;
    }
    
    console.log("Phillboard update successful:", data);
    return data;
  } catch (error) {
    console.error("Exception in updatePhillboardInDatabase:", error);
    throw handleServiceError(error, "Exception updating phillboard");
  }
};
