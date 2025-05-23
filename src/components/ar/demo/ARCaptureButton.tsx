
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARCaptureButtonProps {
  onClick: () => void;
}

const ARCaptureButton = ({ onClick }: ARCaptureButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="bg-neon-cyan/60 hover:bg-neon-cyan/80 text-black rounded-full h-16 w-16 flex items-center justify-center"
    >
      <Camera className="h-8 w-8" />
    </Button>
  );
};

export default ARCaptureButton;
