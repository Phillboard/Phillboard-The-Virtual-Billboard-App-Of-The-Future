
import { usePhillboardFeed } from "./feed/hooks/usePhillboardFeed";
import { FeedContent } from "./feed/FeedContent";

export function FeedScreen() {
  const { phillboards, isLoading } = usePhillboardFeed();
  
  return (
    <div className="screen p-4 pb-24 pt-8 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400">Recent Activity</h1>
      <FeedContent 
        phillboards={phillboards} 
        isLoading={isLoading} 
      />
    </div>
  );
}
