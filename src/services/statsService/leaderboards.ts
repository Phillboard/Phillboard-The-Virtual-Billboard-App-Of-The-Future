
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardResponse } from "./types";
import { LeaderboardEntry } from "@/components/stats/types";

/**
 * Fetch leaderboard data for top creators, editors, earners, and balances
 */
export async function fetchLeaderboardData(): Promise<LeaderboardResponse> {
  try {
    // Get top creators (users who placed the most phillboards)
    const { data: topCreatorsData } = await supabase
      .rpc('get_top_creators', { limit_count: 5 });
    
    const topCreators = Array.isArray(topCreatorsData) 
      ? topCreatorsData.map((item, index) => ({
          username: item.username || 'Anonymous',
          avatar_url: item.avatar_url || undefined,
          value: Number(item.phillboard_count),
          rank: index + 1
        }))
      : [];
    
    // Get top editors (users who made the most edits)
    const { data: topEditorsData } = await supabase
      .rpc('get_top_editors', { limit_count: 5 });
    
    const topEditors = Array.isArray(topEditorsData)
      ? topEditorsData.map((item, index) => ({
          username: item.username || 'Anonymous',
          avatar_url: item.avatar_url || undefined,
          value: Number(item.edit_count),
          rank: index + 1
        }))
      : [];
    
    // Get top earners (users who earned the most money)
    const { data: topEarnersData } = await supabase
      .rpc('get_top_earners', { limit_count: 5 });
    
    const topEarners = Array.isArray(topEarnersData)
      ? topEarnersData.map((item, index) => ({
          username: item.username || 'Anonymous',
          avatar_url: item.avatar_url || undefined,
          value: Number(item.earnings || 0),
          rank: index + 1
        }))
      : [];

    // Fetch top balances data with improved error handling
    const topBalances = await fetchTopBalances();
    
    return {
      topCreators,
      topEditors,
      topEarners,
      topBalances
    };
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return {
      topCreators: [],
      topEditors: [],
      topEarners: [],
      topBalances: []
    };
  }
}

/**
 * Helper function to fetch users with top balances - completely rewritten
 * to avoid join issues and directly fetch profiles separately
 */
async function fetchTopBalances(): Promise<LeaderboardEntry[]> {
  try {
    console.log("Fetching top balances...");
    
    // Get the top 5 balance records
    const { data: balancesData, error: balanceError } = await supabase
      .from('user_balances')
      .select('id, balance')
      .order('balance', { ascending: false })
      .limit(5);
    
    if (balanceError || !balancesData) {
      console.error("Error fetching balances:", balanceError);
      return [];
    }
    
    console.log("Balances data:", balancesData);
    
    // Get all profiles to match with the balance data
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url');
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }
    
    // Create a profile map for quick lookups
    const profileMap: Record<string, any> = {};
    if (Array.isArray(profilesData)) {
      profilesData.forEach(profile => {
        if (profile.id) {
          profileMap[profile.id] = profile;
        }
      });
    }
    
    // Map the balance data to the expected format
    return balancesData.map((item, index) => {
      const profile = profileMap[item.id] || {};
      return {
        username: profile.username || 'User ' + item.id.substring(0, 8),
        avatar_url: profile.avatar_url,
        value: Number(item.balance || 0),
        rank: index + 1
      };
    });
  } catch (error) {
    console.error("Error in fetchTopBalances:", error);
    return [];
  }
}

/**
 * Removed the fetchTopBalancesFallback function as it's no longer needed
 * with our simplified approach above.
 */
