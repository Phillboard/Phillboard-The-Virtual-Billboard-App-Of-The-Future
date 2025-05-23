
// Type definitions for stats components

// Type definition for leaderboard entries
export interface LeaderboardEntry {
  username: string;
  avatar_url?: string;
  value: number;
  rank: number;
}

// Type definition for stats data
export interface StatsData {
  totalPhillboards: number;
  totalUsers: number;
  totalEdits: number;
  totalMoneySpent: number;
  userPhillboards: number;
  userEdits: number;
  userEarnings: number;
  userSpent: number;
  dailyPlacements: {name: string; value: number}[];
  topCreators: LeaderboardEntry[];
  topEditors: LeaderboardEntry[];
  topEarners: LeaderboardEntry[];
  topBalances: LeaderboardEntry[];
  mostEditedPhillboards: {
    id: string;
    title: string;
    username: string;
    edits: number;
  }[];
}

// Type definitions for database function results
export interface TopCreator {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  phillboard_count: number;
}

export interface TopEditor {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  edit_count: number;
}

export interface TopEarner {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  earnings: number;
}

export interface TopBalance {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  balance: number;
}

export interface MostEditedPhillboard {
  phillboard_id: string;
  title: string | null;
  username: string | null;
  edit_count: number;
}
