
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

interface ARDemoProps {
  onBack: () => void;
}

const ARDemo = ({ onBack }: ARDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isCapturing, setIsCapturing] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  
  // Initialize camera when component mounts
  useEffect(() => {
    initializeCamera();
    return () => {
      // Clean up - stop all media tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);
  
  // Initialize the camera stream
  const initializeCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera access is not supported by your browser");
      setHasPermission(false);
      return;
    }
    
    try {
      // Stop any existing stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        setHasPermission(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access your camera");
      setHasPermission(false);
    }
  };
  
  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };
  
  // Capture current frame with overlay
  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Draw phillboard overlay
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const width = canvas.width * 0.3;
      const height = canvas.height * 0.2;
      
      // Draw phillboard background
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(centerX - width/2, centerY - height/2, width, height);
      
      // Draw phillboard border
      context.strokeStyle = '#00FFFF';
      context.lineWidth = 2;
      context.strokeRect(centerX - width/2, centerY - height/2, width, height);
      
      // Add text
      context.fillStyle = '#00FFFF';
      context.font = `${width * 0.08}px Arial`;
      context.textAlign = 'center';
      context.fillText('PHILLBOARD DEMO', centerX, centerY);
      context.font = `${width * 0.05}px Arial`;
      context.fillText('@user', centerX, centerY + height * 0.2);
      
      // Save the captured image
      const dataURL = canvas.toDataURL('image/png');
      setOverlayImage(dataURL);
      setIsCapturing(true);
      
      toast.success("Phillboard placed in AR!");
    }
  };
  
  // Reset to camera view
  const resetCapture = () => {
    setIsCapturing(false);
    setOverlayImage(null);
  };
  
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold text-white mb-4">Camera access denied</h3>
            <p className="text-gray-300 mb-6">We need camera access to show the AR experience</p>
            <Button onClick={initializeCamera}>Try Again</Button>
          </div>
        </div>
      )}
      
      {/* Video stream - hidden when showing captured image */}
      <div className={`${isCapturing ? 'hidden' : 'block'} h-full w-full`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted
        />
      </div>
      
      {/* Canvas for capturing and displaying image */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Display captured image */}
      {isCapturing && overlayImage && (
        <div className="absolute inset-0">
          <img src={overlayImage} className="h-full w-full object-cover" alt="AR view" />
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 z-50">
        {!isCapturing ? (
          <>
            <Button 
              onClick={toggleCamera} 
              className="bg-black/50 hover:bg-black/70 text-white"
              size="icon"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button 
              onClick={captureImage} 
              className="bg-neon-cyan/60 hover:bg-neon-cyan/80 text-black rounded-full h-16 w-16 flex items-center justify-center"
            >
              <Camera className="h-8 w-8" />
            </Button>
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
      
      {/* Instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
        {isCapturing ? "Phillboard placed!" : "Point camera at a flat surface"}
      </div>
    </div>
  );
};

export default ARDemo;
