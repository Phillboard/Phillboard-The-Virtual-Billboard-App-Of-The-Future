
import { StatsData, TopCreator, TopEditor, TopEarner, TopBalance, MostEditedPhillboard, LeaderboardEntry } from "@/components/stats/types";

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
  topCreators: LeaderboardEntry[];
  topEditors: LeaderboardEntry[];
  topEarners: LeaderboardEntry[];
  topBalances: LeaderboardEntry[];
}

export interface DailyPlacementsResponse {
  dailyPlacements: { name: string; value: number }[];
}

export interface MostEditedResponse {
  mostEditedPhillboards: LeaderboardEntry[];
}
