
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Text, Environment } from "@react-three/drei";
import { checkARSupport } from "@/utils/arUtils";
import { useNavigate } from "react-router-dom";

// AR Scene Component
function ARScene() {
  const [placePosition, setPlacePosition] = useState<THREE.Vector3 | null>(null);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="city" />
      
      {/* Default Phillboards */}
      <PhillboardObject position={[0, 0, -1]} text="Tech Hub" username="NeonRider" />
      <PhillboardObject position={[1, 0.5, -2]} text="Future Now" username="DigitalNomad" />
    </>
  );
}

// Phillboard Object Component
function PhillboardObject({ position, text, username = "User" }: { 
  position: [number, number, number], 
  text: string, 
  username?: string 
}) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group position={position} ref={groupRef}>
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
        {text}
      </Text>
      
      <Text
        position={[0, -0.1, 0.03]}
        fontSize={0.03}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        @{username}
      </Text>
    </group>
  );
}

// WebXR Button Component
function WebXRButton() {
  const navigate = useNavigate();
  const handleLaunchAR = async () => {
    try {
      // Check if WebXR is supported
      const isSupported = await checkARSupport();
      
      if (isSupported) {
        toast.success("Launching AR experience");
        // Navigate to the dedicated AR view
        navigate('/ar-view');
      } else {
        toast.warning("AR not supported on your device");
      }
    } catch (error) {
      console.error("Error launching AR:", error);
      toast.error("Failed to launch AR experience");
    }
  };

  return (
    <Button 
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
      onClick={handleLaunchAR}
    >
      Launch AR Experience
    </Button>
  );
}

// Main ARScreen Component
export function ARScreen() {
  const [showPlacement, setShowPlacement] = useState(false);
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  
  // Check AR support on component mount
  useState(() => {
    checkARSupport().then(setARSupported);
  });
  
  const handleCancel = () => {
    setShowPlacement(false);
    toast.info("Placement canceled");
  };
  
  const handlePlacePhillboard = () => {
    setShowPlacement(true);
    toast.info("Tap where you'd like to place your phillboard");
  };
  
  return (
    <div className="screen relative bg-black p-0 h-full">
      <div className="absolute inset-0">
        <Canvas>
          <ARScene />
        </Canvas>
        
        {/* AR Info Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
          AR Preview
        </div>
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 space-y-4">
          {arSupported === null ? (
            <div className="bg-black/40 text-white/50 border border-white/10 py-2 px-4 rounded-md">
              Checking AR Support...
            </div>
          ) : arSupported ? (
            <div className="flex flex-col gap-4">
              <WebXRButton />
              <Button 
                className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
                onClick={handlePlacePhillboard}
              >
                Place Phillboard
              </Button>
            </div>
          ) : (
            <div className="bg-black/60 text-red-400 border border-red-900 py-2 px-4 rounded-md text-center">
              AR not supported on this device.<br/>
              <span className="text-xs text-white/50">Try Chrome on Android</span>
            </div>
          )}
        </div>
        
        {/* Placement UI */}
        {showPlacement && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="phillboard w-40 shadow-neon-cyan bg-black/80 pointer-events-auto">
              <div className="text-center">
                <h3 className="text-neon-cyan mb-1">New Phillboard</h3>
                <p className="text-sm text-white/70">Tap to place here</p>
              </div>
            </div>
            
            <div className="absolute bottom-24 w-full flex justify-center gap-4 p-4 pointer-events-auto">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 max-w-[120px] bg-black/60 border-white/20 hover:bg-black/80"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
