
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function UserBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_balances')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setBalance(data?.balance !== undefined ? Number(data.balance) : null);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBalance();
  }, [user]);
  
  if (isLoading) {
    return (
      <Card className="p-4 bg-black/40 border border-white/10">
        <div className="flex items-center">
          <Wallet className="mr-3 text-neon-cyan" />
          <div>
            <p className="text-sm text-gray-400">Your Balance</p>
            <div className="h-6 w-24 bg-white/10 animate-pulse rounded mt-1"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <div className="flex items-center">
        <Wallet className="mr-3 text-neon-cyan" />
        <div>
          <p className="text-sm text-gray-400">Your Balance</p>
          <p className="text-xl font-bold text-neon-cyan">
            ${balance !== null ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </p>
        </div>
      </div>
    </Card>
  );
}
