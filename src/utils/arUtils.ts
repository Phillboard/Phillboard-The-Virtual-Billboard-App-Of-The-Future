
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
