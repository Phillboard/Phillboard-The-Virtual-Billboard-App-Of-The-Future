import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import 'webxr-polyfill';
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";
import { checkARSupport, ARViewMode } from "@/utils/arUtils";
import ARContent from "@/components/ar/ARContent";
import CustomARButton from "@/components/ar/CustomARButton";
import UnsupportedARView from "@/components/ar/UnsupportedARView";
import BackButton from "@/components/ar/BackButton";
import SimulatedARView from "@/components/ar/SimulatedARView";
import { Button } from "@/components/ui/button";

/**
 * Set up WebXR context within the Canvas
 */
function ARSetup({ viewMode }: { viewMode: ARViewMode }) {
  const [isHitTestReady, setIsHitTestReady] = useState(false);
  
  // Component to handle WebXR setup
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="city" />
      <CustomARButton />
    </>
  );
}

/**
 * Main AR view page component
 */
const ARView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState<MapPin | null>(null);
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<ARViewMode>(ARViewMode.HUMAN);
  const [useSimulatedAR, setUseSimulatedAR] = useState(true); // Default to simulated for development
  
  useEffect(() => {
    // Check if WebXR/AR is supported
    checkARSupport().then(setARSupported);
    
    // Get the pin from location state
    const pinData = location.state?.pin as MapPin | undefined;
    const mode = location.state?.viewMode as ARViewMode | undefined;
    
    if (mode) {
      setViewMode(mode);
    }
    
    if (!pinData) {
      toast.error("No Phillboard data found");
      navigate('/');
      return;
    }
    
    setPin(pinData);
  }, [location.state, navigate]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleTryDemo = () => {
    navigate('/', { state: { showARDemo: true } });
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === ARViewMode.HUMAN ? ARViewMode.BILLBOARD : ARViewMode.HUMAN);
  };

  const toggleARMode = () => {
    setUseSimulatedAR(!useSimulatedAR);
  };
  
  // Use simulated AR for development
  if (useSimulatedAR) {
    return (
      <div className="relative">
        <div className="absolute top-16 right-4 z-30">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={toggleARMode}
            className="text-xs"
          >
            Switch to Real AR
          </Button>
        </div>
        <SimulatedARView 
          pin={pin} 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
        />
      </div>
    );
  }
  
  // Early exit if WebXR is not supported (for real AR mode)
  if (arSupported === false) {
    return <UnsupportedARView onBack={handleBack} onTryDemo={handleTryDemo} />;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-10">
        <BackButton onClick={handleBack} />
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={toggleARMode}
          className="text-xs"
        >
          Switch to Simulated AR
        </Button>
        <Button 
          variant="outline" 
          className="bg-black/60 border-white/20 text-xs"
          onClick={toggleViewMode}
        >
          {viewMode === ARViewMode.HUMAN ? "Switch to Billboard" : "Switch to Human"}
        </Button>
      </div>
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
        {viewMode === ARViewMode.HUMAN ? "Human View" : "Billboard View"}: {pin?.title || "Loading AR view..."}
      </div>
      
      <div className="h-screen w-full">
        <Canvas
          onCreated={({ gl }) => {
            // Enable WebXR and set up
            gl.xr.enabled = true;
          }}
        >
          <ARSetup viewMode={viewMode} />
          <ARContent pin={pin} viewMode={viewMode} />
        </Canvas>
      </div>
    </div>
  );
};

export default ARView;
