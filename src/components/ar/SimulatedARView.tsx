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
        fontSize={0.05}
        color="#00FFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {pin.title}
      </Text>
      
      {/* Username */}
      <Text
        position={[0, -0.1, 0.03]}
        fontSize={0.03}
        color="white"
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
 * Camera background to simulate real world view
 */
function CameraBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.log('Camera not available, using gradient background');
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-sky-300 via-sky-500 to-sky-700" />
      )}
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
      {/* Camera background */}
      <CameraBackground />
      
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
        Click and drag to orbit • Scroll to zoom • Click phillboard to interact
      </div>
      
      {/* 3D Scene */}
      <div className="h-screen w-full">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 75 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 0); // Transparent background
          }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <directionalLight position={[-10, -10, 5]} intensity={0.5} />
          
          <Environment preset="city" background={false} />
          
          <SimulatedARContent pin={pin} viewMode={viewMode} />
          
          {/* Camera controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default SimulatedARView;