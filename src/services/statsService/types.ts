
import { StatsData, TopCreator, TopEditor, TopEarner, TopBalance, MostEditedPhillboard } from "@/components/stats/types";

// Types for the service response data 
export interface GlobalStatsResponse {
  totalPhillboards: number;
  totalUsers: number;
  totalEdits: number;
  totalMoneySpent: number;
}

export interface UserStatsResponse {
  userPhillboards: number;
  userEdits: number;
  userEarnings: number;
  userSpent: number;
}

export interface LeaderboardResponse {
  topCreators: TopCreator[];
  topEditors: TopEditor[];
  topEarners: TopEarner[];
  topBalances: TopBalance[];
}

export interface DailyPlacementsResponse {
  dailyPlacements: { name: string; value: number }[];
}

export interface MostEditedResponse {
  mostEditedPhillboards: MostEditedPhillboard[];
}
