
import { supabase } from "@/integrations/supabase/client";

export async function getUserBalance(): Promise<number | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    const { data, error } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('id', session.user.id)
      .single();
    
    if (error) throw error;
    return data?.balance ? Number(data.balance) : null;
  } catch (err) {
    console.error("Error getting user balance:", err);
    return null;
  }
}

export async function getUserTransactions() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];
    
    return [];
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    return [];
  }
}
