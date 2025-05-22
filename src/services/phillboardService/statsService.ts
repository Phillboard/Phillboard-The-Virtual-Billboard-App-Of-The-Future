
import { supabase } from "@/integrations/supabase/client";

// Get user phillboard count
export async function getUserPhillboardCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('phillboards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching phillboard count:", error);
      throw error;
    }
    
    return count || 0;
  } catch (err) {
    console.error("Failed to fetch phillboard count:", err);
    return 0;
  }
}

// Calculate phillboard percentile for a user
export async function getPhillboardPercentile(userId: string): Promise<number> {
  try {
    // First, get the user's count
    const userCount = await getUserPhillboardCount(userId);
    
    if (userCount === 0) return 0;
    
    // Then, get counts of all users
    const { data, error } = await supabase
      .from('phillboards')
      .select('user_id')
      .not('user_id', 'is', null);
      
    if (error) {
      console.error("Error fetching phillboard user data:", error);
      throw error;
    }
    
    // Group by user_id and count
    const userCounts = data.reduce((acc, item) => {
      const uid = item.user_id as string;
      acc[uid] = (acc[uid] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array of counts
    const counts = Object.values(userCounts);
    
    // Calculate percentile
    const lowerCounts = counts.filter(count => count < userCount);
    const percentile = (lowerCounts.length / counts.length) * 100;
    
    return percentile;
  } catch (err) {
    console.error("Failed to calculate phillboard percentile:", err);
    return 0;
  }
}
