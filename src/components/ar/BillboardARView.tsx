
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { Text, Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * Billboard-scale AR view component
 */
export function BillboardARView() {
  const [showPlacement, setShowPlacement] = useState(false);
  
  return (
    <div className="h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Environment preset="city" />
        
        {/* Billboard scale - larger and positioned further away */}
        <group position={[0, 1, -4]} scale={3}>
          <mesh scale={[0.9, 0.5, 0.05]} castShadow>
            <boxGeometry />
            <meshStandardMaterial color="black" opacity={0.7} transparent />
          </mesh>
          
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.1}
            color="#FF6347"
            anchorX="center"
            anchorY="middle"
          >
            Billboard View
          </Text>
          
          <Text
            position={[0, -0.15, 0.03]}
            fontSize={0.05}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            @DigitalNomad
          </Text>
        </group>
      </Canvas>
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
        Billboard View Mode
      </div>
    </div>
  );
}

export default BillboardARView;
