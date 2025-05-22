
import { useState, useEffect } from "react";
import { BarChart } from "@/components/ui/barChart";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Chart data structure
interface ChartDataItem {
  name: string;
  value: number;
}

// Top phillboard structure
interface TopPhillboard {
  id: string;
  title: string;
  username: string;
  views: number;
}

export function StatsScreen() {
  const [totalPhillboards, setTotalPhillboards] = useState<number>(0);
  const [userPhillboards, setUserPhillboards] = useState<number>(0);
  const [placementsData, setPlacementsData] = useState<ChartDataItem[]>([]);
  const [topPhillboards, setTopPhillboards] = useState<TopPhillboard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  // Days of the week for chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Fetch total phillboard count
        const { count: totalCount, error: totalError } = await supabase
          .from('phillboards')
          .select('*', { count: 'exact', head: true });
          
        if (totalError) throw totalError;
        
        // Fetch user's phillboards count
        let userCount = 0;
        if (user) {
          const { count, error } = await supabase
            .from('phillboards')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (!error) userCount = count || 0;
        }
        
        // Calculate placements over time - group by day of week
        // In a real app, you'd use created_at timestamps
        const { data: timeData, error: timeError } = await supabase
          .from('phillboards')
          .select('created_at');
          
        if (timeError) throw timeError;
        
        // Count phillboards by day of week
        const daysCounts = new Array(7).fill(0);
        
        if (timeData) {
          timeData.forEach(item => {
            if (item.created_at) {
              const date = new Date(item.created_at);
              const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
              daysCounts[dayOfWeek]++;
            }
          });
        }
        
        const chartData: ChartDataItem[] = daysOfWeek.map((day, index) => ({
          name: day,
          value: daysCounts[index],
        }));
        
        // Fetch top phillboards
        const { data: topData, error: topError } = await supabase
          .from('phillboards')
          .select('id, title, username')
          .order('created_at', { ascending: false })
          .limit(3);
          
        const formattedTopData = topData ? topData.map((item, index) => ({
          id: item.id,
          title: item.title,
          username: item.username,
          // Simulating view counts for display purposes
          views: 342 - (index * 70 + Math.floor(Math.random() * 30))
        })) : [];
        
        setTotalPhillboards(totalCount || 0);
        setUserPhillboards(userCount);
        setPlacementsData(chartData);
        setTopPhillboards(formattedTopData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);

  return (
    <div className="screen bg-black">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>
      
      <div className="space-y-6">
        {/* Global Stats */}
        <div className="neon-card p-4 rounded-lg border border-gray-800 bg-black/60">
          <h2 className="text-lg font-semibold mb-4">Global Stats</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Phillboards</p>
              <p className="text-3xl font-bold text-cyan-400">
                {isLoading ? '...' : totalPhillboards}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Your Phillboards</p>
              <p className="text-3xl font-bold text-fuchsia-500">
                {isLoading ? '...' : userPhillboards}
              </p>
            </div>
          </div>
        </div>
        
        {/* Placements Chart */}
        <div className="neon-card p-4 rounded-lg border border-gray-800 bg-black/60">
          <h2 className="text-lg font-semibold mb-3">Placements By Day of Week</h2>
          <div className="h-60 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400">Loading chart data...</p>
              </div>
            ) : (
              <BarChart
                data={placementsData}
                index="name"
                categories={["value"]}
                colors={["#00FFFF"]}
                valueFormatter={(value) => `${value} placements`}
                className="text-sm"
              />
            )}
          </div>
        </div>
        
        {/* Top Phillboards */}
        <div className="neon-card p-4 rounded-lg border border-gray-800 bg-black/60">
          <h2 className="text-lg font-semibold mb-3">Top Phillboards</h2>
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading top phillboards...</p>
          ) : topPhillboards.length > 0 ? (
            <div className="space-y-3">
              {topPhillboards.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                      index === 1 ? "bg-gray-400/20 text-gray-400" :
                      "bg-amber-600/20 text-amber-600"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-400">by @{item.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.views}</p>
                    <p className="text-sm text-gray-400">views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-400">No phillboards found</p>
          )}
        </div>
      </div>
    </div>
  );
}
