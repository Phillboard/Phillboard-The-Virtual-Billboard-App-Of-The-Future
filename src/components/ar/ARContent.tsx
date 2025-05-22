
import { useState, useEffect } from "react";
import { Interactive } from "@react-three/xr";
import { Text } from "@react-three/drei";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";
import { ARViewMode, getARScaling, getARPosition } from "@/utils/arUtils";

interface ARContentProps {
  pin: MapPin | null;
  viewMode?: ARViewMode;
}

/**
 * Interactive ARContent component with tap functionality
 */
export const ARContent = ({ pin, viewMode = ARViewMode.HUMAN }: ARContentProps) => {
  const [hovered, setHovered] = useState(false);
  const scaling = getARScaling(viewMode);
  const position = getARPosition(viewMode);
  
  if (!pin) return null;
  
  return (
    <Interactive 
      onSelect={() => toast.info(`Interacting with "${pin.title}"`)}
      onHover={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <group position={position} scale={scaling * (hovered ? 1.1 : 1)}>
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

export default ARContent;
