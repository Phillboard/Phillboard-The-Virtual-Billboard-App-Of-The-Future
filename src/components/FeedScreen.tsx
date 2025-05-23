
import { usePhillboardFeed } from "./feed/hooks/usePhillboardFeed";
import { FeedContent } from "./feed/FeedContent";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function FeedScreen() {
  const { phillboards, isLoading, activityFeed } = usePhillboardFeed();
  const [activeTab, setActiveTab] = useState<"all" | "placements" | "edits">("all");
  
  const filterActivity = () => {
    if (!activityFeed) return [];
    
    switch (activeTab) {
      case "placements":
        return activityFeed.filter(item => item.type === 'placement');
      case "edits":
        return activityFeed.filter(item => item.type === 'edit');
      default:
        return activityFeed;
    }
  };
  
  return (
    <div className="screen p-4 pb-24 pt-8 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-2 text-cyan-400">Recent Activity</h1>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-4">
        <TabsList className="bg-black/40">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20">
            All
          </TabsTrigger>
          <TabsTrigger value="placements" className="data-[state=active]:bg-cyan-500/20">
            Placements
          </TabsTrigger>
          <TabsTrigger value="edits" className="data-[state=active]:bg-cyan-500/20">
            Edits
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <FeedContent 
        phillboards={phillboards} 
        isLoading={isLoading}
        activityFeed={filterActivity()}
      />
    </div>
  );
}
