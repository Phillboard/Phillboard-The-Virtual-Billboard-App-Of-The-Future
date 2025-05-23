
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { StatsData } from "@/components/stats/types";
import { 
  fetchGlobalStats, 
  fetchUserStats, 
  fetchLeaderboardData, 
  fetchDailyPlacements, 
  fetchMostEditedPhillboards 
} from "@/services/statsService";

/**
 * Hook to fetch and combine all stats data
 */
export function useStatsData(user: User | null) {
  const [statsData, setStatsData] = useState<StatsData>({
    totalPhillboards: 0,
    totalUsers: 0,
    totalEdits: 0,
    totalMoneySpent: 0,
    userPhillboards: 0,
    userEdits: 0,
    userEarnings: 0,
    userSpent: 0,
    dailyPlacements: [],
    topCreators: [],
    topEditors: [],
    topEarners: [],
    topBalances: [],
    mostEditedPhillboards: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAllStatsData() {
      setIsLoading(true);
      try {
        // Fetch all different types of stats data in parallel
        const [
          globalStats,
          userStats,
          leaderboardData,
          dailyPlacementsData,
          mostEditedData
        ] = await Promise.all([
          fetchGlobalStats(),
          fetchUserStats(user),
          fetchLeaderboardData(),
          fetchDailyPlacements(),
          fetchMostEditedPhillboards()
        ]);

        // Combine all data into a single StatsData object
        setStatsData({
          ...globalStats,
          ...userStats,
          ...leaderboardData,
          ...dailyPlacementsData,
          ...mostEditedData
        });
      } catch (error) {
        console.error("Error fetching stats data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAllStatsData();
    
    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchAllStatsData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  return { statsData, isLoading };
}
