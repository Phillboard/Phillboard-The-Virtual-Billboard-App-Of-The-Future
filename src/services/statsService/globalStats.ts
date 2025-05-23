
import { supabase } from "@/integrations/supabase/client";
import { GlobalStatsResponse } from "./types";

/**
 * Fetch global statistics including total phillboards, users, edits, and money spent
 */
export async function fetchGlobalStats(): Promise<GlobalStatsResponse> {
  try {
    // Get global statistics
    const { count: phillboardsCount } = await supabase
      .from('phillboards')
      .select('*', { count: 'exact', head: true });
    
    // Get total users count
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get total edits count
    const { count: editsCount } = await supabase
      .from('phillboards_edit_history')
      .select('*', { count: 'exact', head: true });
      
    // Get total money spent
    const { data: totalSpentData } = await supabase
      .from('phillboards_edit_history')
      .select('cost')
      .gt('cost', 0);
      
    const totalMoneySpent = totalSpentData?.reduce(
      (sum, item) => sum + Number(item.cost), 0
    ) || 0;
    
    return {
      totalPhillboards: phillboardsCount || 0,
      totalUsers: usersCount || 0,
      totalEdits: editsCount || 0,
      totalMoneySpent
    };
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return {
      totalPhillboards: 0,
      totalUsers: 0,
      totalEdits: 0,
      totalMoneySpent: 0
    };
  }
}
