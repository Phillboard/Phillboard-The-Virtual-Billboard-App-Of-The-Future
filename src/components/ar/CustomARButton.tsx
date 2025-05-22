
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useXREvent, useXR } from "@react-three/xr";

/**
 * Custom AR button component that uses @react-three/xr hooks to manage WebXR session
 */
export const CustomARButton = () => {
  const { isPresenting, sessionManager } = useXR();
  
  const handleARToggle = async () => {
    try {
      if (isPresenting) {
        await sessionManager.exitXR();
      } else {
        await sessionManager.enterXR('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body }
        });
        toast.success("AR session started");
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
      {isPresenting ? "Exit AR" : "Enter AR"}
    </Button>
  );
};

export default CustomARButton;
