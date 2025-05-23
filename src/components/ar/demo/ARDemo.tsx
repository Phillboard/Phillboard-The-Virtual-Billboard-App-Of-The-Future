
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ARCameraView from "./ARCameraView";
import ARCapturedImage from "./ARCapturedImage";
import ARControls from "./ARControls";
import ARPermissionDenied from "./ARPermissionDenied";
import ARStatusIndicator from "./ARStatusIndicator";
import { useARCamera } from "./useARCamera";

interface ARDemoProps {
  onBack: () => void;
}

const ARDemo = ({ onBack }: ARDemoProps) => {
  const {
    videoRef,
    canvasRef,
    hasPermission,
    isStreaming,
    isCapturing,
    overlayImage,
    initializeCamera,
    toggleCamera,
    captureImage,
    resetCapture
  } = useARCamera();
  
  return (
    <div className="relative h-full w-full bg-black">
      {/* Back button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-4 left-4 z-50 bg-black/50 text-white"
        onClick={onBack}
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* Permission denied */}
      {hasPermission === false && (
        <ARPermissionDenied onRetry={initializeCamera} />
      )}
      
      {/* Video stream - hidden when showing captured image */}
      <ARCameraView 
        isStreaming={isStreaming} 
        isCapturing={isCapturing} 
        videoRef={videoRef} 
      />
      
      {/* Canvas for capturing and displaying image */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Display captured image */}
      <ARCapturedImage 
        isCapturing={isCapturing} 
        overlayImage={overlayImage} 
      />
      
      {/* Controls */}
      <ARControls
        isCapturing={isCapturing}
        toggleCamera={toggleCamera}
        captureImage={captureImage}
        resetCapture={resetCapture}
      />
      
      {/* Instructions */}
      <ARStatusIndicator isCapturing={isCapturing} />
    </div>
  );
};

export default ARDemo;
