import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Controllers, useXR } from "@react-three/xr";

/**
 * Custom AR button component that uses @react-three/xr hooks to manage WebXR session
 */
export const CustomARButton = () => {
  const xr = useXR();
  
  const handleARToggle = async () => {
    try {
      if (xr.session) {
        // If there's an active session, exit it
        xr.session.end();
      } else {
        // Otherwise start a new AR session with required features
        navigator.xr?.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body }
        }).then((session) => {
          xr.setSession(session);
          toast.success("AR session started");
        });
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
      {xr.session ? "Exit AR" : "Enter AR"}
    </Button>
  );
};

export default CustomARButton;
