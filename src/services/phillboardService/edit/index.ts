
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
    // Calculate the cost
    const editCost = await calculateEditCost(phillboardId, userId);
    
    // Process the payment
    const paymentResult = await processEditPayment(editCost, userId, phillboardId);
    
    // Record this edit in history
    await recordEditHistory(phillboardId, userId, editCost);
    
    // Pay the original creator if applicable
    if (paymentResult.originalCreatorId) {
      await payOriginalCreator(paymentResult.originalCreatorId, userId, editCost);
    }
    
    // Update the phillboard
    const updatedPhillboard = await updatePhillboardInDatabase(phillboardId, updates);
    
    return {
      success: true,
      data: updatedPhillboard,
      message: paymentResult.message
    };
  } catch (error) {
    // Use our centralized error handler
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
