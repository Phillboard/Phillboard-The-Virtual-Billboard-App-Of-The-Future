
import { supabase } from "@/integrations/supabase/client";

/**
 * Get current balance for authenticated user
 * @returns User balance or null if not authenticated
 */
export async function getUserBalance(): Promise<number | null> {
  try {
    // Check if we have user authentication
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

/**
 * Get transaction history for user's phillboard placements
 */
export async function getUserTransactions() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];
    
    // This would be where we fetch transaction history if we had a transactions table
    // For now, we'll just return an empty array
    return [];
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    return [];
  }
}
