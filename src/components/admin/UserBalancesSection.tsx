
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        setIsLoading(true);
        
        // Get all user balances
        const { data: balanceData, error: balanceError } = await supabase
          .from('user_balances')
          .select('*');
        
        if (balanceError) throw balanceError;
        
        // Get all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username');
          
        if (profilesError) throw profilesError;
        
        // Merge the data
        const mergedData = (balanceData || []).map(balanceItem => {
          const profile = profilesData?.find(p => p.id === balanceItem.id);
          return {
            id: balanceItem.id,
            email: profile?.username || 'Unknown User',
            balance: Number(balanceItem.balance)
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
    
    // Set up a realtime subscription to update balances when they change
    const channel = supabase
      .channel('user_balances_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'user_balances'
        }, 
        () => {
          fetchBalances();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
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
            
            {balances.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white">User</TableHead>
                      <TableHead className="text-white text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map(user => (
                      <TableRow key={user.id} className="border-white/10">
                        <TableCell>
                          <div className="truncate max-w-[300px]">
                            <p className="font-medium text-white">{user.email}</p>
                            <p className="text-xs text-gray-400">ID: {user.id.substring(0, 8)}...</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="font-bold text-neon-cyan">
                            ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-6 border border-white/10 rounded-md bg-black/20">
                <p className="text-gray-400">No user balances found</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
