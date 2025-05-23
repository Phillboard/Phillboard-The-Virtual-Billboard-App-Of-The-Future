
import { Card } from "@/components/ui/card";
import { LeaderboardEntry } from "./types";
import { formatCurrency } from "./utils";
import { LucideIcon } from "lucide-react";

interface LeaderboardListProps {
  title: string;
  entries: LeaderboardEntry[];
  isLoading: boolean;
  icon: LucideIcon;
  iconColor: string;
  valueSuffix?: string;
  formatValue?: (value: number) => string;
}

export function LeaderboardList({
  title,
  entries,
  isLoading,
  icon: Icon,
  iconColor,
  valueSuffix = "",
  formatValue = (value) => `${value}`
}: LeaderboardListProps) {
  // Debug logging
  console.log(`LeaderboardList ${title}:`, entries);
  
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <h3 className="font-semibold mb-3 flex items-center">
        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
        {title}
      </h3>
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading leaderboard...</p>
      ) : entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((item) => (
            <div key={`${title}-${item.rank}`} className="flex items-center justify-between border-b border-white/5 pb-2">
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
                <p className="font-medium">{formatValue(item.value)}</p>
                <p className="text-xs text-gray-400">{valueSuffix}</p>
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
