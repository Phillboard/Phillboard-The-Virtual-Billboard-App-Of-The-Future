
import { StatsData } from "./types";
import { GlobalStatsCards } from "./GlobalStatsCards";
import { DailyPlacementsChart } from "./DailyPlacementsChart";
import { MostEditedPhillboards } from "./MostEditedPhillboards";
import { UserStatsCards } from "./UserStatsCards";
import { User } from "@supabase/supabase-js";

interface GlobalStatsViewProps {
  statsData: StatsData;
  isLoading: boolean;
  user: User | null;
}

export function GlobalStatsView({
  statsData,
  isLoading,
  user
}: GlobalStatsViewProps) {
  return (
    <div className="space-y-6">
      {/* Global Stats Overview */}
      <GlobalStatsCards
        totalPhillboards={statsData.totalPhillboards}
        totalUsers={statsData.totalUsers}
        totalEdits={statsData.totalEdits}
        totalMoneySpent={statsData.totalMoneySpent}
        isLoading={isLoading}
      />
      
      {/* Daily Placements Chart */}
      <DailyPlacementsChart 
        dailyPlacements={statsData.dailyPlacements}
        isLoading={isLoading}
      />
      
      {/* User Stats (if logged in) */}
      {user && (
        <UserStatsCards
          userPhillboards={statsData.userPhillboards}
          userEdits={statsData.userEdits}
          userEarnings={statsData.userEarnings}
          userSpent={statsData.userSpent}
          isLoading={isLoading}
        />
      )}
      
      {/* Most Edited Phillboards */}
      <MostEditedPhillboards
        mostEditedPhillboards={statsData.mostEditedPhillboards}
        isLoading={isLoading}
      />
    </div>
  );
}
