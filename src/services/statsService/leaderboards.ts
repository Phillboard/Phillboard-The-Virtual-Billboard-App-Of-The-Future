
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
 * Helper function to fetch users with top balances
 */
async function fetchTopBalances(): Promise<LeaderboardEntry[]> {
  try {
    // First attempt: join with profiles table
    const { data: topBalancesData, error: balanceError } = await supabase
      .from('user_balances')
      .select(`
        id,
        balance,
        profiles!user_balances_id_fkey (
          username,
          avatar_url
        )
      `)
      .order('balance', { ascending: false })
      .limit(5);
    
    console.log("Top balances query result:", topBalancesData);
    console.log("Balance error if any:", balanceError);
    
    // If join doesn't work, try the direct approach
    if (!topBalancesData || balanceError) {
      return await fetchTopBalancesFallback();
    }
    
    return Array.isArray(topBalancesData)
      ? topBalancesData.map((item, index) => ({
          username: item.profiles?.username || 'Unknown User',
          avatar_url: item.profiles?.avatar_url || undefined,
          value: Number(item.balance || 0),
          rank: index + 1
        }))
      : [];
  } catch (error) {
    console.error("Error fetching top balances:", error);
    return await fetchTopBalancesFallback();
  }
}

/**
 * Fallback method to fetch top balances when the join doesn't work
 */
async function fetchTopBalancesFallback(): Promise<LeaderboardEntry[]> {
  try {
    // Get balance data directly
    const { data: directBalancesData } = await supabase
      .from('user_balances')
      .select('*')
      .order('balance', { ascending: false })
      .limit(5);
    
    console.log("Direct balances query:", directBalancesData);
    
    // Get profiles for mapping
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username, avatar_url');
    
    // Create a map of profile data by id for quick lookup
    const profileMap = profilesData ? 
      profilesData.reduce((acc: Record<string, any>, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {}) : {};
    
    return Array.isArray(directBalancesData)
      ? directBalancesData.map((item: any, index) => {
          const profile = profileMap[item.id] || {};
          return {
            username: profile.username || 'Unknown User',
            avatar_url: profile.avatar_url || undefined,
            value: Number(item.balance || 0),
            rank: index + 1
          };
        })
      : [];
  } catch (error) {
    console.error("Error in fallback method for top balances:", error);
    return [];
  }
}
