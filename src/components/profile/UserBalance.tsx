
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowDownLeft, Award } from "lucide-react";
import { getUserBalance } from "@/services/phillboardService";
import { getUserPhillboardCount } from "@/services/phillboardService";

// Interface for user stats
interface UserStats {
  balance: number;
  totalPlaced: number;
  totalEarned: number;
  totalSpent: number;
}

export function UserBalance() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    balance: 0,
    totalPlaced: 0,
    totalEarned: 0,
    totalSpent: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get current balance
        const userBalance = await getUserBalance();
        
        // Get phillboard count
        const phillboardCount = await getUserPhillboardCount(user.id);
        
        // Calculate earnings from edited phillboards (only when others edit your phillboards)
        // Query the edit history to get earnings
        const { data: editEarnings, error: earningsError } = await supabase
          .from('phillboards_edit_history')
          .select('phillboard_id, cost')
          .eq('user_id', user.id);

        // Query to get placements where user is credited as original creator
        const { data: creatorEarnings, error: creatorError } = await supabase
          .from('phillboards_edit_history')
          .select('cost')
          .neq('user_id', user.id)
          .eq('original_creator_id', user.id);

        // Sum up earnings (50% of edit costs from others editing your phillboards)
        let totalEarned = 0;
        if (creatorEarnings && creatorEarnings.length > 0) {
          totalEarned = creatorEarnings.reduce((sum, item) => sum + (Number(item.cost) * 0.5), 0);
        }
        
        // Calculate total spent on placements and edits
        // Query all edits by this user
        const { data: userEdits, error: editsError } = await supabase
          .from('phillboards_edit_history')
          .select('cost')
          .eq('user_id', user.id);

        // Sum up what user has spent on edits
        let totalSpent = 0;
        if (userEdits && userEdits.length > 0) {
          totalSpent = userEdits.reduce((sum, item) => sum + Number(item.cost), 0);
        }
        
        // Add cost of phillboard placements ($1 each)
        totalSpent += phillboardCount;
        
        setUserStats({
          balance: userBalance || 0,
          totalPlaced: phillboardCount || 0,
          totalEarned: totalEarned || 0,
          totalSpent: totalSpent || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    // Set up a realtime subscription to update balance when it changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'user_balances',
          filter: `id=eq.${user?.id}` 
        }, 
        (payload) => {
          setUserStats(prev => ({
            ...prev,
            balance: Number(payload.new.balance)
          }));
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  if (isLoading) {
    return (
      <Card className="p-4 bg-black/40 border border-white/10">
        <div className="flex items-center justify-center">
          <Wallet className="mr-3 text-neon-cyan" />
          <div className="w-full">
            <p className="text-sm text-gray-400">Your Balance</p>
            <div className="h-6 w-24 bg-white/10 animate-pulse rounded mt-1"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Format numbers for display
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };
  
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <div className="flex justify-between">
        <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-black/20 border border-white/5 m-1">
          <Wallet className="h-6 w-6 mb-2 text-neon-cyan animate-pulse" />
          <p className="text-xs text-gray-400">Your Balance</p>
          <p className="text-lg font-bold text-neon-cyan">
            {formatCurrency(userStats.balance)}
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-black/20 border border-white/5 m-1">
          <TrendingUp className="h-6 w-6 mb-2 text-green-400" />
          <p className="text-xs text-gray-400">Total Earned</p>
          <p className="text-lg font-semibold text-green-400">
            {formatCurrency(userStats.totalEarned)}
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-black/20 border border-white/5 m-1">
          <ArrowDownLeft className="h-6 w-6 mb-2 text-amber-400" />
          <p className="text-xs text-gray-400">Total Spent</p>
          <p className="text-lg font-semibold text-amber-400">
            {formatCurrency(userStats.totalSpent)}
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center p-3 rounded-lg bg-black/20 border border-white/5 m-1">
          <Award className="h-6 w-6 mb-2 text-fuchsia-400" />
          <p className="text-xs text-gray-400">Phillboards</p>
          <p className="text-lg font-semibold text-fuchsia-400">
            {userStats.totalPlaced}
          </p>
        </div>
      </div>
    </Card>
  );
}
