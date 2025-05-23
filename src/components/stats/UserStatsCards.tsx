
import { Card } from "@/components/ui/card";
import { Map, ArrowDownLeft, TrendingUp } from "lucide-react";
import { formatCurrency } from "./utils";

interface UserStatsCardsProps {
  userPhillboards: number;
  userEdits: number;
  userEarnings: number;
  userSpent: number;
  isLoading: boolean;
}

export function UserStatsCards({
  userPhillboards,
  userEdits,
  userEarnings,
  userSpent,
  isLoading
}: UserStatsCardsProps) {
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <h3 className="font-semibold mb-3">Your Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Map className="h-6 w-6 mr-3 text-fuchsia-400" />
          <div>
            <p className="text-xs text-gray-400">Your Phillboards</p>
            <p className="text-lg font-bold text-fuchsia-400">
              {isLoading ? '...' : userPhillboards}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <ArrowDownLeft className="h-6 w-6 mr-3 text-amber-400" />
          <div>
            <p className="text-xs text-gray-400">Your Edits</p>
            <p className="text-lg font-bold text-amber-400">
              {isLoading ? '...' : userEdits}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
          <div>
            <p className="text-xs text-gray-400">Your Earnings</p>
            <p className="text-lg font-bold text-green-400">
              {isLoading ? '...' : formatCurrency(userEarnings)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <ArrowDownLeft className="h-6 w-6 mr-3 text-red-400" />
          <div>
            <p className="text-xs text-gray-400">Your Spending</p>
            <p className="text-lg font-bold text-red-400">
              {isLoading ? '...' : formatCurrency(userSpent)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
