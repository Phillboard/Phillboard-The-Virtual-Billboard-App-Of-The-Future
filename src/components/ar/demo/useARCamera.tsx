
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export const useARCamera = () => {
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

  return {
    videoRef,
    canvasRef,
    isStreaming,
    hasPermission,
    facingMode,
    isCapturing,
    overlayImage,
    initializeCamera,
    toggleCamera,
    captureImage,
    resetCapture
  };
};
