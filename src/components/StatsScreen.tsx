
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatsData } from "@/hooks/useStatsData";
import { GlobalStatsView } from "@/components/stats/GlobalStatsView";
import { LeaderboardView } from "@/components/stats/LeaderboardView";

export function StatsScreen() {
  const [activeTab, setActiveTab] = useState<string>("global");
  const { user } = useAuth();
  const { statsData, isLoading } = useStatsData(user);
  
  return (
    <div className="screen bg-black">
      <h1 className="text-2xl font-bold mb-4">Phillboard Statistics</h1>
      
      <Tabs defaultValue="global" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="global" className="text-sm">Global Stats</TabsTrigger>
          <TabsTrigger value="leaderboards" className="text-sm">Leaderboards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global">
          <GlobalStatsView 
            statsData={statsData} 
            isLoading={isLoading} 
            user={user} 
          />
        </TabsContent>
        
        <TabsContent value="leaderboards">
          <LeaderboardView 
            statsData={statsData} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
