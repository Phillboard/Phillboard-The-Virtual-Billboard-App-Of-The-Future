import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  StatsData,
  TopCreator,
  TopEditor,
  TopEarner,
  TopBalance,
  MostEditedPhillboard
} from "@/components/stats/types";

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
    async function fetchStatsData() {
      setIsLoading(true);
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
        
        // Get user specific stats
        let userPhillboards = 0;
        let userEdits = 0;
        let userEarnings = 0;
        let userSpent = 0;
        
        if (user) {
          // Count user's phillboards
          const { count: userPhillboardsCount } = await supabase
            .from('phillboards')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          userPhillboards = userPhillboardsCount || 0;
          
          // Count user's edits
          const { count: userEditsCount } = await supabase
            .from('phillboards_edit_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          userEdits = userEditsCount || 0;
          
          // Calculate user's earnings from others editing their phillboards
          const { data: creatorEarnings } = await supabase
            .from('phillboards_edit_history')
            .select('cost')
            .neq('user_id', user.id)
            .eq('original_creator_id', user.id);
          
          userEarnings = creatorEarnings?.reduce(
            (sum, item) => sum + (Number(item.cost) * 0.5), 0
          ) || 0;
          
          // Calculate user's total spent
          const { data: userSpentData } = await supabase
            .from('phillboards_edit_history')
            .select('cost')
            .eq('user_id', user.id);
          
          userSpent = userSpentData?.reduce(
            (sum, item) => sum + Number(item.cost), 0
          ) || 0;
        }
        
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
        
        // Get top creators (users who placed the most phillboards)
        const { data: topCreatorsData } = await supabase
          .rpc('get_top_creators', { limit_count: 5 });
        
        const topCreators = Array.isArray(topCreatorsData) 
          ? topCreatorsData.map((item: TopCreator, index) => ({
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
          ? topEditorsData.map((item: TopEditor, index) => ({
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
          ? topEarnersData.map((item: TopEarner, index) => ({
              username: item.username || 'Anonymous',
              avatar_url: item.avatar_url || undefined,
              value: Number(item.earnings || 0),
              rank: index + 1
            }))
          : [];

        // Get users with highest balances - Fixed query
        // First get all user balances and join with profiles for username
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
        
        // If that doesn't work, try a more direct approach
        if (!topBalancesData || balanceError) {
          const { data: directBalancesData } = await supabase
            .from('user_balances')
            .select('*')
            .order('balance', { ascending: false })
            .limit(5);
          
          console.log("Direct balances query:", directBalancesData);
          
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, avatar_url');
          
          // Create a map of profile data by id for quick lookup
          const profileMap = profilesData ? 
            profilesData.reduce((acc: Record<string, any>, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {}) : {};
          
          const topBalances = Array.isArray(directBalancesData)
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
          
          console.log("Manually constructed top balances:", topBalances);
          
          // Get most edited phillboards
          const { data: mostEditedData } = await supabase
            .rpc('get_most_edited_phillboards', { limit_count: 5 });
        
          const mostEditedPhillboards = Array.isArray(mostEditedData)
            ? mostEditedData.map((item: MostEditedPhillboard) => ({
                id: item.phillboard_id,
                title: item.title || 'Untitled',
                username: item.username || 'Anonymous',
                edits: Number(item.edit_count)
              }))
            : [];
          
          setStatsData({
            totalPhillboards: phillboardsCount || 0,
            totalUsers: usersCount || 0,
            totalEdits: editsCount || 0,
            totalMoneySpent,
            userPhillboards,
            userEdits,
            userEarnings,
            userSpent,
            dailyPlacements,
            topCreators,
            topEditors,
            topEarners,
            topBalances,
            mostEditedPhillboards
          });

          setIsLoading(false);
          return;
        }
        
        const topBalances = Array.isArray(topBalancesData)
          ? topBalancesData.map((item: any, index) => ({
              username: item.profiles?.username || 'Unknown User',
              avatar_url: item.profiles?.avatar_url || undefined,
              value: Number(item.balance || 0),
              rank: index + 1
            }))
          : [];
          
        console.log("Processed top balances:", topBalances);
        
        // Get most edited phillboards
        const { data: mostEditedData } = await supabase
          .rpc('get_most_edited_phillboards', { limit_count: 5 });
        
        const mostEditedPhillboards = Array.isArray(mostEditedData)
          ? mostEditedData.map((item: MostEditedPhillboard) => ({
              id: item.phillboard_id,
              title: item.title || 'Untitled',
              username: item.username || 'Anonymous',
              edits: Number(item.edit_count)
            }))
          : [];
        
        setStatsData({
          totalPhillboards: phillboardsCount || 0,
          totalUsers: usersCount || 0,
          totalEdits: editsCount || 0,
          totalMoneySpent,
          userPhillboards,
          userEdits,
          userEarnings,
          userSpent,
          dailyPlacements,
          topCreators,
          topEditors,
          topEarners,
          topBalances,
          mostEditedPhillboards
        });
        
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStatsData();
    
    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchStatsData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  return { statsData, isLoading };
}
