
// Helper functions for stats components

/**
 * Format currency with proper locale and denomination
 */
export const formatCurrency = (amount: number): string => {
  // Handle potential NaN or undefined values
  if (isNaN(amount) || amount === undefined) {
    return "$0.00";
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format number with commas for better readability
 */
export const formatNumber = (value: number): string => {
  // Handle potential NaN or undefined values
  if (isNaN(value) || value === undefined) {
    return "0";
  }
  
  return new Intl.NumberFormat('en-US').format(value);
};
