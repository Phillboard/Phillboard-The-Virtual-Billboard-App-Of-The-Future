
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "@/components/map/types";
import { toast } from "sonner";

// Calculate cost for placement based on existing phillboards at the same location
async function calculatePlacementCost(lat: number, lng: number, userId: string | undefined): Promise<{ 
  cost: number, 
  originalCreatorId: string | null,
  overwriteCount: number
}> {
  try {
    // Use a tolerance value for lat/lng comparison to find phillboards at "same" location
    const tolerance = 0.0001; // Approximately 10 meters
    
    const { data: existingPhillboards, error } = await supabase
      .from('phillboards')
      .select('id, user_id, created_at')
      .lt('lat', lat + tolerance)
      .gt('lat', lat - tolerance)
      .lt('lng', lng + tolerance)
      .gt('lng', lng - tolerance)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error finding existing phillboards:", error);
      return { cost: 1, originalCreatorId: null, overwriteCount: 0 };
    }
    
    // Get the original creator ID (most recent one that isn't the current user)
    let originalCreatorId: string | null = null;
    if (existingPhillboards && existingPhillboards.length > 0) {
      const otherUserPhillboards = existingPhillboards.filter(pb => pb.user_id !== userId);
      if (otherUserPhillboards.length > 0) {
        originalCreatorId = otherUserPhillboards[0].user_id;
      }
    }
    
    // No matter how many existing phillboards at this location, new placement cost is $1
    return { 
      cost: 1, 
      originalCreatorId, 
      overwriteCount: existingPhillboards?.length || 0 
    };
  } catch (err) {
    console.error("Error calculating placement cost:", err);
    return { cost: 1, originalCreatorId: null, overwriteCount: 0 }; // Default to $1 if error
  }
}

// Handle the financial transaction for placing a phillboard
async function processPhillboardTransaction(
  cost: number, 
  userId: string,
  originalCreatorId: string | null
): Promise<boolean> {
  try {
    // First check if user has enough balance
    const { data: userBalance, error: balanceError } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('id', userId)
      .single();
      
    if (balanceError) {
      console.error("Error getting user balance:", balanceError);
      toast.error("Failed to check your balance. Please try again.");
      return false;
    }
    
    if (!userBalance || userBalance.balance < cost) {
      toast.error(`Insufficient funds. You need $${cost.toFixed(2)} to place this phillboard.`);
      return false;
    }
    
    // Update user's balance
    const { error: updateError } = await supabase
      .from('user_balances')
      .update({ 
        balance: userBalance.balance - cost,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating user balance:", updateError);
      toast.error("Payment processing error. Please try again.");
      return false;
    }
    
    console.log(`Deducted $${cost} from user ${userId}'s balance`);
    
    // If there's an original creator who gets 50% of the overwrite cost
    if (originalCreatorId) {
      const creatorShare = cost * 0.5;
      
      console.log(`Attempting to pay $${creatorShare} to creator ${originalCreatorId}`);
      
      try {
        const { data, error: creatorUpdateError } = await supabase
          .rpc('add_to_balance', { 
            user_id: originalCreatorId, 
            amount: creatorShare 
          });
          
        if (creatorUpdateError) {
          console.error("Error paying original creator:", creatorUpdateError);
          // Continue anyway, we don't want to block the placement
        } else {
          console.log(`Successfully paid $${creatorShare} to creator ${originalCreatorId}`);
          toast.info(`The original creator earned $${creatorShare.toFixed(2)} from your placement.`);
        }
      } catch (err) {
        console.error("Exception when paying creator:", err);
        // Continue anyway, we don't want to block the placement
      }
    }
    
    // Record this placement in history for earnings tracking
    try {
      await supabase
        .from('phillboards_edit_history')
        .insert({
          phillboard_id: 'new-placement', // Temporary ID, will be replaced after phillboard creation
          user_id: userId,
          cost: cost,
          original_creator_id: originalCreatorId
        });
    } catch (err) {
      console.error("Failed to record placement history:", err);
      // Non-critical, continue with placement
    }
    
    return true;
  } catch (err) {
    console.error("Error processing transaction:", err);
    toast.error("Payment processing error. Please try again.");
    return false;
  }
}

// Create a new phillboard
export async function createPhillboard(phillboard: Omit<MapPin, 'id' | 'distance'> & { user_id?: string }) {
  try {
    console.log("Creating new phillboard:", phillboard);
    
    // Check if we have user authentication
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.user;
    
    // If user is not authenticated, we'll return a locally created phillboard
    if (!isAuthenticated) {
      console.log("User not authenticated, returning local phillboard");
      return {
        id: Date.now().toString(),
        lat: phillboard.lat,
        lng: phillboard.lng,
        title: phillboard.title,
        username: phillboard.username,
        image_type: phillboard.image_type || 'text',
        content: phillboard.content || null,
        created_at: new Date().toISOString(),
        placement_type: phillboard.placement_type || 'human'
      };
    }
    
    // Calculate placement cost and find original creator if any
    const { cost, originalCreatorId, overwriteCount } = await calculatePlacementCost(
      phillboard.lat, 
      phillboard.lng, 
      session.user.id
    );
    
    console.log(`Placement will cost $${cost}, original creator: ${originalCreatorId || 'none'}, overwrite count: ${overwriteCount}`);
    
    // Process payment for placement
    const transactionSuccess = await processPhillboardTransaction(
      cost, 
      session.user.id, 
      originalCreatorId
    );
    
    if (!transactionSuccess) {
      throw new Error("Transaction failed");
    }
    
    // Show cost information to the user
    toast.info(`Phillboard placed for $${cost.toFixed(2)}`);
    
    const { data, error } = await supabase
      .from('phillboards')
      .insert([
        {
          title: phillboard.title,
          username: phillboard.username,
          lat: phillboard.lat,
          lng: phillboard.lng,
          image_type: phillboard.image_type || 'text',
          content: phillboard.content || null,
          user_id: session.user.id, // Always use the authenticated user's ID
          placement_type: phillboard.placement_type || 'human'
        }
      ])
      .select();
      
    if (error) {
      console.error("Error creating phillboard:", error);
      toast.error("Failed to create phillboard: " + error.message);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("No data returned from phillboard creation");
      toast.error("Failed to create phillboard");
      throw new Error("Failed to create phillboard");
    }
    
    // Update the history record with the actual phillboard ID
    if (data[0].id) {
      try {
        await supabase
          .from('phillboards_edit_history')
          .update({ phillboard_id: data[0].id })
          .eq('phillboard_id', 'new-placement')
          .eq('user_id', session.user.id);
      } catch (err) {
        console.error("Failed to update placement history with ID:", err);
        // Non-critical error, continue
      }
    }
    
    console.log("Created phillboard successfully:", data[0]);
    return data[0];
  } catch (err) {
    console.error("Failed to create phillboard:", err);
    throw err;
  }
}
