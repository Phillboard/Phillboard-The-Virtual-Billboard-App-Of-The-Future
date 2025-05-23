
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARCameraToggleProps {
  onClick: () => void;
}

const ARCameraToggle = ({ onClick }: ARCameraToggleProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="bg-black/50 hover:bg-black/70 text-white"
      size="icon"
    >
      <RotateCcw className="h-6 w-6" />
    </Button>
  );
};

export default ARCameraToggle;
