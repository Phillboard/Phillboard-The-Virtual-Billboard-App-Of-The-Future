import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Environment, OrbitControls } from "@react-three/drei";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";
import { ARViewMode, getARScaling, getARPosition } from "@/utils/arUtils";
import BackButton from "./BackButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SimulatedARContentProps {
  pin: MapPin | null;
  viewMode: ARViewMode;
}

/**
 * Simulated AR Content that floats in 3D space
 */
function SimulatedARContent({ pin, viewMode }: SimulatedARContentProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<any>();
  const scaling = getARScaling(viewMode);
  const position = getARPosition(viewMode);

  // Add gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (!pin) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scaling * (hovered ? 1.1 : 1)}
      onClick={() => toast.info(`Clicked on "${pin.title}"`)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main phillboard panel */}
      <mesh scale={[0.5, 0.3, 0.05]} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial 
          color={hovered ? "#00FFCC" : "#1a1a1a"} 
          opacity={0.9} 
          transparent
          emissive={hovered ? "#00FFCC" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {pin.title}
      </Text>
      
      {/* Username */}
      <Text
        position={[0, -0.08, 0.03]}
        fontSize={0.04}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        @{pin.username}
      </Text>
      
      {/* Content */}
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
      
      {/* Interactive glow effect */}
      {hovered && (
        <mesh scale={[0.6, 0.4, 0.1]}>
          <boxGeometry />
          <meshBasicMaterial 
            color="#00FFCC" 
            opacity={0.2} 
            transparent
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Realistic outdoor environment simulation
 */
function SimulatedBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="w-full h-full relative overflow-hidden">
        {/* Sky with clouds */}
        <div className="w-full h-2/3 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 relative">
          <div className="absolute top-20 left-1/4 w-32 h-16 bg-white/70 rounded-full blur-sm" />
          <div className="absolute top-32 right-1/3 w-24 h-12 bg-white/60 rounded-full blur-sm" />
          <div className="absolute top-16 right-1/4 w-20 h-10 bg-white/50 rounded-full blur-sm" />
        </div>
        
        {/* Ground/street level */}
        <div className="w-full h-1/3 bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400 relative">
          {/* Sidewalk texture */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-300 border-t border-gray-400" />
          
          {/* Street elements */}
          <div className="absolute bottom-16 left-10 w-3 h-12 bg-gray-800 rounded-sm" /> {/* Lamppost */}
          <div className="absolute bottom-20 right-20 w-8 h-16 bg-green-600 rounded-full" /> {/* Tree */}
          <div className="absolute bottom-16 right-1/2 w-12 h-8 bg-red-600 rounded" /> {/* Mailbox */}
          
          {/* Building silhouettes */}
          <div className="absolute bottom-16 left-1/4 w-16 h-20 bg-gray-700 opacity-50" />
          <div className="absolute bottom-16 right-1/3 w-20 h-24 bg-gray-600 opacity-50" />
        </div>
        
        {/* Perspective lines for depth */}
        <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/20" />
        <div className="absolute bottom-1/4 left-1/4 right-1/4 h-px bg-white/10" />
      </div>
    </div>
  );
}

interface SimulatedARViewProps {
  pin: MapPin | null;
  viewMode: ARViewMode;
  onViewModeChange: (mode: ARViewMode) => void;
}

export function SimulatedARView({ pin, viewMode, onViewModeChange }: SimulatedARViewProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const toggleViewMode = () => {
    const newMode = viewMode === ARViewMode.HUMAN ? ARViewMode.BILLBOARD : ARViewMode.HUMAN;
    onViewModeChange(newMode);
  };

  return (
    <div className="min-h-screen relative">
      {/* Simulated background */}
      <SimulatedBackground />
      
      {/* UI Controls */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton onClick={handleBack} />
      </div>
      
      <div className="absolute top-4 right-4 z-20">
        <Button 
          variant="outline" 
          className="bg-black/60 border-white/20 text-xs text-white"
          onClick={toggleViewMode}
        >
          {viewMode === ARViewMode.HUMAN ? "Switch to Billboard" : "Switch to Human"}
        </Button>
      </div>
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-20">
        <span className="text-neon-cyan">SIMULATED AR</span> - {viewMode === ARViewMode.HUMAN ? "Human View" : "Billboard View"}: {pin?.title || "Loading..."}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-xs text-white z-20">
        Walk around • Look up/down • Get closer to interact with phillboards
      </div>
      
      {/* 3D Scene */}
      <div className="h-screen w-full">
        <Canvas
          camera={{ position: [0, 1.6, 2], fov: 75 }} // Eye-level camera height
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 0); // Transparent background
          }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
          <pointLight position={[0, 5, 0]} intensity={0.5} />
          
          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#666666" opacity={0.3} transparent />
          </mesh>
          
          {/* Environmental elements */}
          <mesh position={[-3, 0, -2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          
          <mesh position={[2, -0.5, -3]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[2, 1, -3]} castShadow>
            <sphereGeometry args={[0.8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
          
          <SimulatedARContent pin={pin} viewMode={viewMode} />
          
          {/* Camera controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.5}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            target={[0, 0, -1.5]}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default SimulatedARView;