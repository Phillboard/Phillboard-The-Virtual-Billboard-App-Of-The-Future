
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditPaymentResult } from "./types";
import { handleServiceError } from "./errorHandling";

/**
 * Process payment for editing a phillboard
 */
export const processEditPayment = async (
  editCost: number, 
  userId: string, 
  phillboardId: string | number
): Promise<EditPaymentResult> => {
  console.log(`Processing payment of $${editCost} from user ${userId} for phillboard ${phillboardId}`);
  
  try {
    // Get user's current balance
    const { data: userBalance, error: balanceError } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('id', userId)
      .single();
      
    if (balanceError) {
      throw handleServiceError(balanceError, "Failed to check your balance. Please try again.");
    }
    
    // Check if user has enough balance
    if (!userBalance || userBalance.balance < editCost) {
      throw new Error(`Insufficient funds. You need $${editCost.toFixed(2)} to edit this phillboard.`);
    }
    
    console.log(`User has sufficient balance: $${userBalance.balance}. Deducting $${editCost}`);
    
    // Update user's balance (deduct the cost)
    const newBalance = Number(userBalance.balance) - Number(editCost);
    const { error: updateError } = await supabase
      .from('user_balances')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      throw handleServiceError(updateError, "Payment processing error. Please try again.");
    }
    
    // Get the original creator from the database
    const { data: originalPhillboard, error: phillboardError } = await supabase
      .from("phillboards")
      .select("user_id")
      .eq("id", String(phillboardId))
      .single();
      
    if (phillboardError) {
      throw handleServiceError(phillboardError, "Failed to get phillboard details.");
    }
    
    const originalCreatorId = originalPhillboard?.user_id !== userId ? originalPhillboard?.user_id : null;
    
    return {
      success: true,
      originalCreatorId,
      message: `Edited phillboard for $${editCost.toFixed(2)}`
    };
  } catch (error) {
    throw handleServiceError(error, "Payment processing failed");
  }
};

/**
 * Pay the original creator their share
 */
export const payOriginalCreator = async (originalCreatorId: string, userId: string, editCost: number) => {
  if (!originalCreatorId || originalCreatorId === userId) {
    console.log("No original creator to pay or creator is current user");
    return { success: true };
  }
  
  const creatorShare = Number(editCost) * 0.5;
  
  try {
    console.log(`Paying original creator ${originalCreatorId} share of $${creatorShare}`);
    
    // Use the add_to_balance database function to add funds safely
    const { data, error: creatorUpdateError } = await supabase
      .rpc('add_to_balance', { 
        user_id: originalCreatorId, 
        amount: creatorShare 
      });
      
    if (creatorUpdateError) {
      console.error("Error paying original creator:", creatorUpdateError);
      toast.error("Failed to pay original creator, but your edit was successful.");
      return { success: false, error: creatorUpdateError };
    } else {
      console.log("Original creator payment successful:", data);
      toast.info(`The original creator earned ${creatorShare.toFixed(2)} from your edit.`);
      return { success: true };
    }
  } catch (err) {
    console.error("Exception when paying creator:", err);
    toast.error("Failed to pay original creator, but your edit was successful.");
    return { success: false, error: err };
  }
};
