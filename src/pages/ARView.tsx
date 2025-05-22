
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { XR, Interactive } from "@react-three/xr";
import { Text, Environment } from "@react-three/drei";

// Interactive ARContent component with tap functionality
const ARContent = ({ pin }: { pin: MapPin | null }) => {
  const [hovered, setHovered] = useState(false);
  
  if (!pin) return null;
  
  return (
    <Interactive 
      onSelect={() => toast.info(`Interacting with "${pin.title}"`)}
      onHover={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <group position={[0, 0, -1]} scale={hovered ? 1.1 : 1}>
        <mesh scale={[0.5, 0.3, 0.05]} castShadow>
          <boxGeometry />
          <meshStandardMaterial 
            color={hovered ? "#00FFCC" : "black"} 
            opacity={0.7} 
            transparent
            emissive={hovered ? "#00FFCC" : "#000000"}
            emissiveIntensity={hovered ? 0.5 : 0}
          />
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
        
        {pin.content && (
          <Text
            position={[0, -0.15, 0.03]}
            fontSize={0.02}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.4}
          >
            {pin.content}
          </Text>
        )}
      </group>
    </Interactive>
  );
};

// Custom ARButton component using manual XR session management
const CustomARButton = () => {
  const [xrSession, setXrSession] = useState<XRSession | null>(null);
  const isPresenting = Boolean(xrSession);
  
  // Check if already in an XR session
  if (isPresenting) return null;
  
  const startXr = async () => {
    try {
      if (!navigator.xr) {
        toast.error("WebXR not supported in your browser");
        return;
      }
      
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });
      
      setXrSession(session);
      
      // Handle session end
      session.addEventListener('end', () => {
        setXrSession(null);
      });
      
      toast.success("AR session started");
    } catch (err) {
      console.error("Failed to start AR session:", err);
      toast.error("Failed to start AR session");
    }
  };
  
  return (
    <Button 
      onClick={startXr}
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
    >
      Enter AR
    </Button>
  );
};

const ARView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState<MapPin | null>(null);
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if WebXR is supported
    if (!('xr' in navigator)) {
      setARSupported(false);
      toast.error("Your browser doesn't support WebXR");
      return;
    }
    
    // Check if immersive-ar session is supported
    // @ts-ignore - TypeScript doesn't know about isSessionSupported yet
    navigator.xr?.isSessionSupported('immersive-ar')
      .then(supported => {
        setARSupported(supported);
        if (!supported) {
          toast.warning("Your device doesn't support AR sessions");
        }
      })
      .catch(err => {
        console.error("Error checking AR support:", err);
        setARSupported(false);
      });
    
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
  
  // Early exit if WebXR is not supported
  if (arSupported === false) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">WebXR Not Supported</h1>
        <p className="text-gray-300 mb-6">
          Your browser or device doesn't support WebXR AR sessions. 
          Please try using Chrome on an ARCore-supported Android device.
        </p>
        <Button onClick={handleBack} className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan">
          Return to Map
        </Button>
      </div>
    );
  }
  
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
          <XR
            sessionInit={{ 
              requiredFeatures: ['hit-test', 'dom-overlay'], 
              domOverlay: { root: document.body } 
            }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Environment preset="city" />
            
            <ARContent pin={pin} />
          </XR>
        </Canvas>
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          {arSupported === null ? (
            <Button disabled className="bg-black/40 text-white/50 border border-white/10 py-2 px-4 rounded-md">
              Checking AR Support...
            </Button>
          ) : arSupported === true ? (
            <CustomARButton />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ARView;
