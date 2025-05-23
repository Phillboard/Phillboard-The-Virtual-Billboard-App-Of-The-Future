
import { Button } from "@/components/ui/button";
import ARCameraToggle from "./ARCameraToggle";
import ARCaptureButton from "./ARCaptureButton";

interface ARControlsProps {
  isCapturing: boolean;
  toggleCamera: () => void;
  captureImage: () => void;
  resetCapture: () => void;
}

const ARControls = ({ 
  isCapturing, 
  toggleCamera, 
  captureImage, 
  resetCapture 
}: ARControlsProps) => {
  return (
    <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 z-50">
      {!isCapturing ? (
        <>
          <ARCameraToggle onClick={toggleCamera} />
          <ARCaptureButton onClick={captureImage} />
        </>
      ) : (
        <Button 
          onClick={resetCapture} 
          className="bg-neon-cyan/60 hover:bg-neon-cyan/80 text-black"
        >
          Place Another Phillboard
        </Button>
      )}
    </div>
  );
};

export default ARControls;
