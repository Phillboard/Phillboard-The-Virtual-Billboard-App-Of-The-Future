
// Types for edit service functionality
export interface EditPaymentResult {
  success: boolean;
  originalCreatorId?: string;
  message: string;
  error?: any;
}

export interface EditHistoryResult {
  success: boolean;
  error?: any;
}

export interface PhillboardUpdateData {
  title: string;
  image_type: string;
  placement_type: string;
}

export interface EditPhillboardResult {
  success: boolean;
  data?: any;
  message: string;
  error?: any;
}
