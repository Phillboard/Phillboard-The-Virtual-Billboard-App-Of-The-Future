
/**
 * Check if the current browser and device support WebXR AR features
 * @returns Promise<boolean> - Returns true if AR is supported
 */
export const checkARSupport = async (): Promise<boolean> => {
  // Check if the WebXR API is available
  if (!('xr' in navigator)) {
    console.log('WebXR API not available');
    return false;
  }
  
  try {
    // Check if immersive-ar session is supported
    return await (navigator.xr as any).isSessionSupported('immersive-ar');
  } catch (err) {
    console.error("Error checking AR support:", err);
    return false;
  }
};

/**
 * AR view modes enum
 */
export enum ARViewMode {
  HUMAN = 'human',
  BILLBOARD = 'billboard'
}

/**
 * Get scaling factor based on AR view mode
 */
export const getARScaling = (mode: ARViewMode): number => {
  switch (mode) {
    case ARViewMode.BILLBOARD:
      return 3.0;
    case ARViewMode.HUMAN:
    default:
      return 1.0;
  }
};

/**
 * Get position offset based on AR view mode
 */
export const getARPosition = (mode: ARViewMode): [number, number, number] => {
  switch (mode) {
    case ARViewMode.BILLBOARD:
      return [0, 1, -4];
    case ARViewMode.HUMAN:
    default:
      return [0, 0, -1.5];
  }
};
