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
        
        // Calculate total earned and spent (from database)
        // For now, we'll use a simplified version where:
        // - Each user starts with $300
        // - Total spent = 300 + total earned - current balance
        const initialBalance = 300; // Users get $300 when they sign up
        
        // Get earnings data - this would ideally come from a transactions table
        // For now, let's query the phillboards table to estimate earnings
        const { data: earnings, error: earningsError } = await supabase
          .from('phillboards')
          .select('id')
          .eq('user_id', user.id);
          
        // Simplistic calculation - in real app would use transactions table
        const totalEarned = earnings ? earnings.length : 0; // $1 per phillboard as base earnings
        
        // Calculate total spent based on initial balance, earnings and current balance
        const totalSpent = initialBalance + totalEarned - (userBalance || 0);
        
        setUserStats({
          balance: userBalance || 0,
          totalPlaced: phillboardCount || 0,
          totalEarned: totalEarned || 0,
          totalSpent: totalSpent > 0 ? totalSpent : 0
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
