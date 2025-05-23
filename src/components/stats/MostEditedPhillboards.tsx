
import { Card } from "@/components/ui/card";
import { LeaderboardEntry } from "./types";

interface MostEditedPhillboardsProps {
  mostEditedPhillboards: LeaderboardEntry[];
  isLoading: boolean;
}

export function MostEditedPhillboards({
  mostEditedPhillboards,
  isLoading
}: MostEditedPhillboardsProps) {
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <h3 className="font-semibold mb-3">Most Edited Phillboards</h3>
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading data...</p>
      ) : mostEditedPhillboards.length > 0 ? (
        <div className="space-y-2">
          {mostEditedPhillboards.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  item.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                  item.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                  "bg-amber-600/20 text-amber-600"
                }`}>
                  {item.rank}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">by {item.username}</p>
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
  );
}
