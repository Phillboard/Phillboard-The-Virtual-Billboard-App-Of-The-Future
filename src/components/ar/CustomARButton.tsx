
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useXR } from "@react-three/xr";

/**
 * Custom AR button component that uses @react-three/xr hooks to manage WebXR session
 */
export const CustomARButton = () => {
  const { isPresenting, setSession } = useXR();
  
  const handleARToggle = async () => {
    try {
      if (isPresenting) {
        setSession(null);
        toast.success("Exited AR session");
      } else {
        toast.success("Starting AR session...");
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
