
import { toast } from "sonner";

/**
 * Generic service error handling utility
 */
export const handleServiceError = (error: any, defaultMessage: string): Error => {
  // Convert any error type to a standard Error object with message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : defaultMessage;
      
  console.error(`Service error: ${errorMessage}`, error);
  
  // Create a new error with the formatted message
  return new Error(errorMessage);
};

/**
 * Handle errors consistently with toast notifications
 */
export const handleServiceErrorWithToast = (error: any, defaultMessage: string): Error => {
  const formattedError = handleServiceError(error, defaultMessage);
  
  // Show toast notification for user
  toast.error(formattedError.message);
  
  return formattedError;
};
