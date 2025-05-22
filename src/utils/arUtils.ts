
/**
 * Check if the current browser and device support WebXR AR features
 * @returns Promise<boolean> - Returns true if AR is supported
 */
export const checkARSupport = async (): Promise<boolean> => {
  // Check if the WebXR API is available
  if (!('xr' in navigator)) {
    return false;
  }
  
  try {
    // Try to check if immersive-ar session is supported
    // @ts-ignore - TypeScript doesn't know about isSessionSupported yet
    return await navigator.xr?.isSessionSupported('immersive-ar');
  } catch (err) {
    console.error("Error checking AR support:", err);
    return false;
  }
};
