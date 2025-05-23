
import { StatsData } from "./types";
import { LeaderboardList } from "./LeaderboardList";
import { Trophy, Crown, BadgePercent, Wallet } from "lucide-react";
import { formatCurrency } from "./utils";

interface LeaderboardViewProps {
  statsData: StatsData;
  isLoading: boolean;
}

export function LeaderboardView({ statsData, isLoading }: LeaderboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Top Creators Leaderboard */}
      <LeaderboardList
        title="Top Phillboard Creators"
        entries={statsData.topCreators}
        isLoading={isLoading}
        icon={Trophy}
        iconColor="text-yellow-500"
        valueSuffix="phillboards"
      />
      
      {/* Top Editors Leaderboard */}
      <LeaderboardList
        title="Top Editors"
        entries={statsData.topEditors}
        isLoading={isLoading}
        icon={Crown}
        iconColor="text-cyan-500"
        valueSuffix="edits"
      />
      
      {/* Top Earners Leaderboard */}
      <LeaderboardList
        title="Top Earners"
        entries={statsData.topEarners}
        isLoading={isLoading}
        icon={BadgePercent}
        iconColor="text-green-500"
        valueSuffix="earned"
        formatValue={(value) => formatCurrency(value)}
      />

      {/* Top Balances Leaderboard */}
      <LeaderboardList
        title="Highest User Balances"
        entries={statsData.topBalances}
        isLoading={isLoading}
        icon={Wallet}
        iconColor="text-purple-500"
        valueSuffix="balance"
        formatValue={(value) => formatCurrency(value)}
      />
    </div>
  );
}
