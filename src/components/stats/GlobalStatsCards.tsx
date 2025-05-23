
import { Card } from "@/components/ui/card";
import { Map, Users, ArrowDownLeft, Wallet } from "lucide-react";
import { formatCurrency } from "./utils";

interface GlobalStatsCardsProps {
  totalPhillboards: number;
  totalUsers: number;
  totalEdits: number;
  totalMoneySpent: number;
  isLoading: boolean;
}

export function GlobalStatsCards({
  totalPhillboards,
  totalUsers,
  totalEdits,
  totalMoneySpent,
  isLoading
}: GlobalStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-3 bg-black/40 border border-white/10">
        <div className="flex items-center">
          <Map className="h-8 w-8 mr-3 text-cyan-400" />
          <div>
            <p className="text-xs text-gray-400">Total Phillboards</p>
            <p className="text-xl font-bold text-cyan-400">
              {isLoading ? '...' : totalPhillboards}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-3 bg-black/40 border border-white/10">
        <div className="flex items-center">
          <Users className="h-8 w-8 mr-3 text-indigo-400" />
          <div>
            <p className="text-xs text-gray-400">Active Users</p>
            <p className="text-xl font-bold text-indigo-400">
              {isLoading ? '...' : totalUsers}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-3 bg-black/40 border border-white/10">
        <div className="flex items-center">
          <ArrowDownLeft className="h-8 w-8 mr-3 text-yellow-400" />
          <div>
            <p className="text-xs text-gray-400">Total Edits</p>
            <p className="text-xl font-bold text-yellow-400">
              {isLoading ? '...' : totalEdits}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-3 bg-black/40 border border-white/10">
        <div className="flex items-center">
          <Wallet className="h-8 w-8 mr-3 text-green-400" />
          <div>
            <p className="text-xs text-gray-400">Total Money Spent</p>
            <p className="text-xl font-bold text-green-400">
              {isLoading ? '...' : formatCurrency(totalMoneySpent)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
