
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * Custom AR button component that manually manages WebXR session
 */
export const CustomARButton = () => {
  const [xrSession, setXrSession] = useState<XRSession | null>(null);
  const isPresenting = Boolean(xrSession);
  
  // Check if already in an XR session
  if (isPresenting) return null;
  
  const startXr = async () => {
    try {
      if (!navigator.xr) {
        toast.error("WebXR not supported in your browser");
        return;
      }
      
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });
      
      setXrSession(session);
      
      // Handle session end
      session.addEventListener('end', () => {
        setXrSession(null);
      });
      
      toast.success("AR session started");
    } catch (err) {
      console.error("Failed to start AR session:", err);
      toast.error("Failed to start AR session");
    }
  };
  
  return (
    <Button 
      onClick={startXr}
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
    >
      Enter AR
    </Button>
  );
};

export default CustomARButton;
