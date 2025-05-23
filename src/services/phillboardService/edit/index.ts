
import { PhillboardUpdateData, EditPhillboardResult } from "./types";
import { calculateEditCost } from "./editCountService";
import { processEditPayment, payOriginalCreator } from "./paymentService";
import { recordEditHistory } from "./editCountService";
import { updatePhillboardInDatabase } from "./updateService";
import { getPlacementType } from "./placementUtils";
import { handleServiceError } from "./errorHandling";

// Re-export all functions for backward compatibility
export * from "./placementUtils";
export * from "./editCountService";
export * from "./paymentService";
export * from "./updateService";
export * from "./types";
export * from "./errorHandling";

/**
 * Handle the entire phillboard edit process
 */
export const editPhillboard = async (
  phillboardId: string | number,
  userId: string,
  updates: PhillboardUpdateData
): Promise<EditPhillboardResult> => {
  try {
    console.log("Starting phillboard edit process:", { phillboardId, userId, updates });
    
    // Calculate the cost
    const editCost = await calculateEditCost(phillboardId, userId);
    console.log(`Edit will cost: $${editCost}`);
    
    // Process the payment
    const paymentResult = await processEditPayment(editCost, userId, phillboardId);
    console.log("Payment processed:", paymentResult);
    
    // Record this edit in history
    await recordEditHistory(phillboardId, userId, editCost);
    
    // Pay the original creator if applicable
    if (paymentResult.originalCreatorId) {
      console.log("Paying original creator:", paymentResult.originalCreatorId);
      await payOriginalCreator(paymentResult.originalCreatorId, userId, editCost);
    }
    
    // Update the phillboard
    try {
      const updatedPhillboard = await updatePhillboardInDatabase(phillboardId, updates);
      console.log("Phillboard successfully updated", updatedPhillboard);
      
      return {
        success: true,
        data: updatedPhillboard,
        message: paymentResult.message
      };
    } catch (updateError) {
      console.error("Failed to update phillboard:", updateError);
      // Payment was successful but update failed
      return {
        success: false,
        message: "Payment processed but phillboard update failed. Please try again.",
        error: updateError
      };
    }
  } catch (error) {
    // Use our centralized error handler
    console.error("Error in editPhillboard:", error);
    const handledError = handleServiceError(
      error, 
      "An error occurred while editing the phillboard"
    );
    
    return {
      success: false,
      message: handledError.message,
      error
    };
  }
};
