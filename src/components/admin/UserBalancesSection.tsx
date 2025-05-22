
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface UserBalanceInfo {
  id: string;
  email: string;
  balance: number;
}

export function UserBalancesSection() {
  const [balances, setBalances] = useState<UserBalanceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        // First get users
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) throw userError;
        
        if (!userData?.users) {
          setBalances([]);
          return;
        }
        
        // Then get balances
        const { data: balanceData, error: balanceError } = await supabase
          .from('user_balances')
          .select('id, balance');
        
        if (balanceError) throw balanceError;
        
        // Merge the data
        const mergedData = userData.users.map(user => {
          const balanceRecord = balanceData?.find(b => b.id === user.id);
          return {
            id: user.id,
            email: user.email || 'No email',
            balance: balanceRecord ? Number(balanceRecord.balance) : 0
          };
        });
        
        setBalances(mergedData);
        
        // Calculate total
        const total = balanceData?.reduce((sum, item) => sum + Number(item.balance), 0) || 0;
        setTotalBalance(total);
      } catch (error) {
        console.error("Error fetching user balances:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBalances();
  }, []);
  
  return (
    <Card className="p-4 border border-white/10 bg-black/40">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Wallet className="mr-2" />
          User Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/5 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-neon-cyan/10 rounded-md border border-neon-cyan/20">
              <p className="text-sm text-gray-400">Total Balance Across All Users</p>
              <p className="text-xl font-bold text-neon-cyan">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {balances.map(user => (
                <div key={user.id} className="p-3 rounded-md bg-black/40 border border-white/10 flex justify-between items-center">
                  <div className="truncate max-w-[70%]">
                    <p className="font-medium text-white truncate">{user.email}</p>
                    <p className="text-xs text-gray-400">ID: {user.id.substring(0, 8)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neon-cyan">
                      ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
              
              {balances.length === 0 && (
                <p className="text-center text-gray-400 py-4">No user balances found</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
