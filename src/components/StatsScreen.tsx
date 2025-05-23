
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import {
  Award,
  TrendingUp,
  Users,
  Map,
  Wallet,
  ArrowUpRight,
  Crown,
  BadgePercent,
  Trophy,
  ArrowDownLeft
} from "lucide-react";
import { BarChart } from "@/components/ui/barChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type definition for leaderboard entries
interface LeaderboardEntry {
  username: string;
  avatar_url?: string;
  value: number;
  rank: number;
}

// Type definition for stats data
interface StatsData {
  totalPhillboards: number;
  totalUsers: number;
  totalEdits: number;
  totalMoneySpent: number;
  userPhillboards: number;
  userEdits: number;
  userEarnings: number;
  userSpent: number;
  dailyPlacements: {name: string; value: number}[];
  topCreators: LeaderboardEntry[];
  topEditors: LeaderboardEntry[];
  topEarners: LeaderboardEntry[];
  mostEditedPhillboards: {
    id: string;
    title: string;
    username: string;
    edits: number;
  }[];
}

// Type definitions for database function results
interface TopCreator {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  phillboard_count: number;
}

interface TopEditor {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  edit_count: number;
}

interface TopEarner {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  earnings: number;
}

interface MostEditedPhillboard {
  phillboard_id: string;
  title: string | null;
  username: string | null;
  edit_count: number;
}

export function StatsScreen() {
  const [activeTab, setActiveTab] = useState<string>("global");
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
    mostEditedPhillboards: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
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
        // Fixed: Don't use 'new Map<string, number>()', use a regular JavaScript object instead
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
        
        // Fixed: Add proper type assertion and null checking
        const topCreators: LeaderboardEntry[] = Array.isArray(topCreatorsData) 
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
        
        // Fixed: Add proper type assertion and null checking
        const topEditors: LeaderboardEntry[] = Array.isArray(topEditorsData)
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
        
        // Fixed: Add proper type assertion and null checking
        const topEarners: LeaderboardEntry[] = Array.isArray(topEarnersData)
          ? topEarnersData.map((item: TopEarner, index) => ({
              username: item.username || 'Anonymous',
              avatar_url: item.avatar_url || undefined,
              value: Number(item.earnings || 0),
              rank: index + 1
            }))
          : [];
        
        // Get most edited phillboards
        const { data: mostEditedData } = await supabase
          .rpc('get_most_edited_phillboards', { limit_count: 5 });
        
        // Fixed: Add proper type assertion and null checking
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
  
  // Format currency helper - Fixed: Use the correct Intl API
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="screen bg-black">
      <h1 className="text-2xl font-bold mb-4">Phillboard Statistics</h1>
      
      <Tabs defaultValue="global" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="global" className="text-sm">Global Stats</TabsTrigger>
          <TabsTrigger value="leaderboards" className="text-sm">Leaderboards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-6">
          {/* Global Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-3 bg-black/40 border border-white/10">
              <div className="flex items-center">
                <Map className="h-8 w-8 mr-3 text-cyan-400" />
                <div>
                  <p className="text-xs text-gray-400">Total Phillboards</p>
                  <p className="text-xl font-bold text-cyan-400">
                    {isLoading ? '...' : statsData.totalPhillboards}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-black/40 border border-white/10">
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3 text-indigo-400" />
                <div>
                  <p className="text-xs text-gray-400">Active Users</p>
                  <p className="text-xl font-bold text-indigo-400">
                    {isLoading ? '...' : statsData.totalUsers}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-black/40 border border-white/10">
              <div className="flex items-center">
                <ArrowDownLeft className="h-8 w-8 mr-3 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Total Edits</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {isLoading ? '...' : statsData.totalEdits}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-black/40 border border-white/10">
              <div className="flex items-center">
                <Wallet className="h-8 w-8 mr-3 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Total Money Spent</p>
                  <p className="text-xl font-bold text-green-400">
                    {isLoading ? '...' : formatCurrency(statsData.totalMoneySpent)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Daily Placements Chart */}
          <Card className="p-4 bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-3">Daily Phillboard Placements</h3>
            <div className="h-60 w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">Loading chart data...</p>
                </div>
              ) : (
                <BarChart
                  data={statsData.dailyPlacements}
                  index="name"
                  categories={["value"]}
                  colors={["#00FFFF"]}
                  valueFormatter={(value) => `${value} placements`}
                  className="text-xs"
                />
              )}
            </div>
          </Card>
          
          {/* User Stats (if logged in) */}
          {user && (
            <Card className="p-4 bg-black/40 border border-white/10">
              <h3 className="font-semibold mb-3">Your Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Map className="h-6 w-6 mr-3 text-fuchsia-400" />
                  <div>
                    <p className="text-xs text-gray-400">Your Phillboards</p>
                    <p className="text-lg font-bold text-fuchsia-400">
                      {isLoading ? '...' : statsData.userPhillboards}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ArrowDownLeft className="h-6 w-6 mr-3 text-amber-400" />
                  <div>
                    <p className="text-xs text-gray-400">Your Edits</p>
                    <p className="text-lg font-bold text-amber-400">
                      {isLoading ? '...' : statsData.userEdits}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Your Earnings</p>
                    <p className="text-lg font-bold text-green-400">
                      {isLoading ? '...' : formatCurrency(statsData.userEarnings)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ArrowDownLeft className="h-6 w-6 mr-3 text-red-400" />
                  <div>
                    <p className="text-xs text-gray-400">Your Spending</p>
                    <p className="text-lg font-bold text-red-400">
                      {isLoading ? '...' : formatCurrency(statsData.userSpent)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* Most Edited Phillboards */}
          <Card className="p-4 bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-3">Most Edited Phillboards</h3>
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading data...</p>
            ) : statsData.mostEditedPhillboards.length > 0 ? (
              <div className="space-y-2">
                {statsData.mostEditedPhillboards.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                        index === 1 ? "bg-gray-400/20 text-gray-400" :
                        "bg-amber-600/20 text-amber-600"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-400">by {item.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.edits}</p>
                      <p className="text-xs text-gray-400">edits</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboards" className="space-y-6">
          {/* Top Creators Leaderboard */}
          <Card className="p-4 bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-3 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Top Phillboard Creators
            </h3>
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading leaderboard...</p>
            ) : statsData.topCreators.length > 0 ? (
              <div className="space-y-3">
                {statsData.topCreators.map((item) => (
                  <div key={`creator-${item.rank}`} className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        item.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        item.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                        item.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                        "bg-white/10 text-white"
                      }`}>
                        {item.rank}
                      </div>
                      <div>
                        <p className="font-medium">{item.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.value}</p>
                      <p className="text-xs text-gray-400">phillboards</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </Card>
          
          {/* Top Editors Leaderboard */}
          <Card className="p-4 bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-3 flex items-center">
              <Crown className="h-5 w-5 mr-2 text-cyan-500" />
              Top Editors
            </h3>
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading leaderboard...</p>
            ) : statsData.topEditors.length > 0 ? (
              <div className="space-y-3">
                {statsData.topEditors.map((item) => (
                  <div key={`editor-${item.rank}`} className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        item.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        item.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                        item.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                        "bg-white/10 text-white"
                      }`}>
                        {item.rank}
                      </div>
                      <div>
                        <p className="font-medium">{item.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.value}</p>
                      <p className="text-xs text-gray-400">edits</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </Card>
          
          {/* Top Earners Leaderboard */}
          <Card className="p-4 bg-black/40 border border-white/10">
            <h3 className="font-semibold mb-3 flex items-center">
              <BadgePercent className="h-5 w-5 mr-2 text-green-500" />
              Top Earners
            </h3>
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading leaderboard...</p>
            ) : statsData.topEarners.length > 0 ? (
              <div className="space-y-3">
                {statsData.topEarners.map((item) => (
                  <div key={`earner-${item.rank}`} className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        item.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        item.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                        item.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                        "bg-white/10 text-white"
                      }`}>
                        {item.rank}
                      </div>
                      <div>
                        <p className="font-medium">{item.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.value)}</p>
                      <p className="text-xs text-gray-400">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
