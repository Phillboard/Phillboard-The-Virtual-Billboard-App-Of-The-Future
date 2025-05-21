
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ARButton, Interactive } from "@react-three/xr";
import { Text } from "@react-three/drei";

// Simple 3D text component for AR
const ARContent = ({ pin }: { pin: MapPin | null }) => {
  if (!pin) return null;
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <group position={[0, 0, -1]}>
        <mesh scale={[0.5, 0.3, 0.05]} castShadow>
          <boxGeometry />
          <meshStandardMaterial color="black" opacity={0.7} transparent />
        </mesh>
        
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.05}
          color="#00FFFF"
          anchorX="center"
          anchorY="middle"
        >
          {pin.title}
        </Text>
        
        <Text
          position={[0, -0.1, 0.03]}
          fontSize={0.03}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          @{pin.username}
        </Text>
      </group>
    </>
  );
};

const ARView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState<MapPin | null>(null);
  
  useEffect(() => {
    // Get the pin from location state
    const pinData = location.state?.pin as MapPin | undefined;
    
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
  
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={handleBack} variant="outline" className="bg-black/60 border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </Button>
      </div>
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
        {pin?.title || "Loading AR view..."}
      </div>
      
      <div className="h-screen w-full">
        <Canvas>
          <ARContent pin={pin} />
        </Canvas>
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
            onClick={() => toast.info("AR functionality is simulated in this preview")}
          >
            Enter AR (Simulated)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ARView;
