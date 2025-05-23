
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserStatsResponse } from "./types";

/**
 * Fetch statistics specific to a user
 */
export async function fetchUserStats(user: User | null): Promise<UserStatsResponse> {
  if (!user) {
    return {
      userPhillboards: 0,
      userEdits: 0,
      userEarnings: 0,
      userSpent: 0
    };
  }

  try {
    // Count user's phillboards
    const { count: userPhillboardsCount } = await supabase
      .from('phillboards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    const userPhillboards = userPhillboardsCount || 0;
    
    // Count user's edits
    const { count: userEditsCount } = await supabase
      .from('phillboards_edit_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    const userEdits = userEditsCount || 0;
    
    // Calculate user's earnings from others editing their phillboards
    const { data: creatorEarnings } = await supabase
      .from('phillboards_edit_history')
      .select('cost')
      .neq('user_id', user.id)
      .eq('original_creator_id', user.id);
    
    const userEarnings = creatorEarnings?.reduce(
      (sum, item) => sum + (Number(item.cost) * 0.5), 0
    ) || 0;
    
    // Calculate user's total spent
    const { data: userSpentData } = await supabase
      .from('phillboards_edit_history')
      .select('cost')
      .eq('user_id', user.id);
    
    const userSpent = userSpentData?.reduce(
      (sum, item) => sum + Number(item.cost), 0
    ) || 0;
    
    return {
      userPhillboards,
      userEdits,
      userEarnings,
      userSpent
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      userPhillboards: 0,
      userEdits: 0,
      userEarnings: 0,
      userSpent: 0
    };
  }
}
