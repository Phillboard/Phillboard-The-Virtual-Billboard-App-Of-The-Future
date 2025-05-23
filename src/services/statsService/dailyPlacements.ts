
import { supabase } from "@/integrations/supabase/client";
import { DailyPlacementsResponse } from "./types";

/**
 * Fetch daily placement data for the last 7 days
 */
export async function fetchDailyPlacements(): Promise<DailyPlacementsResponse> {
  try {
    // Get daily placements for the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const { data: recentPlacements } = await supabase
      .from('phillboards')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());
    
    // Group placements by day
    const dailyPlacementMap: Record<string, number> = {};
    
    // Initialize with 0 counts for all 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const formattedDate = date.toISOString().split('T')[0];
      dailyPlacementMap[formattedDate] = 0;
    }
    
    // Count placements per day
    if (recentPlacements) {
      recentPlacements.forEach(placement => {
        const date = new Date(placement.created_at);
        const formattedDate = date.toISOString().split('T')[0];
        
        if (formattedDate in dailyPlacementMap) {
          dailyPlacementMap[formattedDate]++;
        }
      });
    }
    
    // Convert to array for chart data
    const dailyPlacements = Object.entries(dailyPlacementMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return { dailyPlacements };
  } catch (error) {
    console.error("Error fetching daily placements:", error);
    return { dailyPlacements: [] };
  }
}
