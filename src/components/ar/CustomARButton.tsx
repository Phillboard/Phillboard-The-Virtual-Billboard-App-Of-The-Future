
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useXR } from "@react-three/xr";

/**
 * Custom AR button component that uses @react-three/xr hooks to manage WebXR session
 */
export const CustomARButton = () => {
  const { session } = useXR();
  
  const handleARToggle = async () => {
    try {
      if (session) {
        // If there's an active session, exit it
        session.end();
      } else {
        // Otherwise start a new AR session with required features
        if (navigator.xr) {
          await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'dom-overlay'],
            domOverlay: { root: document.body }
          });
          
          // The session will be managed by the XR component
          toast.success("AR session started");
        } else {
          toast.error("WebXR not available in your browser");
        }
      }
    } catch (err) {
      console.error("Failed to toggle AR session:", err);
      toast.error("Failed to start AR session");
    }
  };
  
  return (
    <Button 
      onClick={handleARToggle}
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
    >
      {session ? "Exit AR" : "Enter AR"}
    </Button>
  );
};

export default CustomARButton;
