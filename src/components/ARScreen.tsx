
import { useState, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton, Controllers, useXR } from "@react-three/xr";
import { Text, useGLTF, Html } from "@react-three/drei";

// AR Content Component
function ARContent() {
  const { isPresenting } = useXR();
  const [placedObjects, setPlacedObjects] = useState<Array<{ id: number; position: [number, number, number]; text: string }>>([]);
  
  const handlePlaceObject = (event: any) => {
    if (!isPresenting) return;
    
    // Get hit position from the AR event
    const position = event.intersection?.point ? 
      [event.intersection.point.x, event.intersection.point.y, event.intersection.point.z] as [number, number, number] : 
      [0, 0, -1] as [number, number, number];

    const newObject = {
      id: Date.now(),
      position,
      text: "New Phillboard"
    };

    setPlacedObjects((prev) => [...prev, newObject]);
    toast.success("Phillboard placed successfully!");
  };
  
  return (
    <>
      <Controllers />
      
      {/* Add some default phillboards */}
      <PhillboardObject position={[0, 0, -1]} text="Tech Hub" username="NeonRider" />
      <PhillboardObject position={[1, 0.5, -2]} text="Future Now" username="DigitalNomad" />
      
      {/* User placed phillboards */}
      {placedObjects.map((obj) => (
        <PhillboardObject 
          key={obj.id} 
          position={obj.position} 
          text={obj.text} 
          username="You"
        />
      ))}
      
      {/* Invisible plane to detect touches */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={handlePlaceObject} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0.0} />
      </mesh>
    </>
  );
}

// Phillboard Component
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

// Main ARScreen Component
export function ARScreen() {
  const [showPlacement, setShowPlacement] = useState(false);
  
  const handleCancel = () => {
    setShowPlacement(false);
    toast.info("Placement canceled");
  };
  
  return (
    <div className="screen relative bg-black p-0 h-full">
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <XR>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <ARContent />
            </XR>
          </Suspense>
        </Canvas>
        
        {/* AR Instructions Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
          Tap on surfaces to place phillboards
        </div>
        
        {/* AR Button */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <ARButton 
            className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
            sessionInit={{
              requiredFeatures: ['hit-test'],
              optionalFeatures: ['dom-overlay'],
              domOverlay: { root: document.body }
            }}
          >
            {(isPresenting) => isPresenting ? 'Exit AR' : 'Enter AR'}
          </ARButton>
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
