
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
    // Use select() followed by single() for proper error handling
    const { data, error } = await supabase
      .from("phillboards")
      .update(updates)
      .eq("id", idString)
      .select()
      .single();

    if (error) {
      throw handleServiceError(error, `Failed to update phillboard`);
    }
    
    if (!data) {
      throw new Error("Failed to retrieve updated phillboard");
    }
    
    console.log("Phillboard update successful:", data);
    return data;
  } catch (error) {
    throw handleServiceError(error, "Exception updating phillboard");
  }
};
