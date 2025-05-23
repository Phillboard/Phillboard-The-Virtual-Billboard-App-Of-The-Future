
import { supabase } from "@/integrations/supabase/client";
import { MostEditedResponse } from "./types";

/**
 * Fetch data about the most edited phillboards
 */
export async function fetchMostEditedPhillboards(): Promise<MostEditedResponse> {
  try {
    const { data: mostEditedData } = await supabase
      .rpc('get_most_edited_phillboards', { limit_count: 5 });
    
    const mostEditedPhillboards = Array.isArray(mostEditedData)
      ? mostEditedData.map((item, index) => ({
          username: item.username || 'Anonymous',
          value: Number(item.edit_count),
          rank: index + 1,
          // Additional fields that might be useful for display
          title: item.title || 'Untitled',
          id: item.phillboard_id
        }))
      : [];
    
    return { mostEditedPhillboards };
  } catch (error) {
    console.error("Error fetching most edited phillboards:", error);
    return { mostEditedPhillboards: [] };
  }
}
