
import { useRef, useEffect } from "react";

interface ARCameraViewProps {
  isStreaming: boolean;
  isCapturing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const ARCameraView = ({ isStreaming, isCapturing, videoRef }: ARCameraViewProps) => {
  return (
    <div className={`${isCapturing ? 'hidden' : 'block'} h-full w-full`}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default ARCameraView;
