
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin } from "@/components/map/types";
import * as THREE from "three";
import { XRSessionInit } from "three";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { createPhillboard } from "@/services/phillboardService";

const ARView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState<MapPin | null>(null);
  const [xrSupported, setXRSupported] = useState<boolean | null>(null);
  const [xrSession, setXRSession] = useState<XRSession | null>(null);
  const [placementReady, setPlacementReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Store XR related objects
  const xrState = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    hitTestSource: null as XRHitTestSource | null,
    xrRefSpace: null as XRReferenceSpace | null,
    phillboardMesh: null as THREE.Mesh | null,
    hitPose: null as XRPose | null,
  });
  
  useEffect(() => {
    // Check if WebXR is supported
    if (!navigator.xr) {
      setXRSupported(false);
      toast.error("Your browser doesn't support WebXR; try Chrome on Android.");
      return;
    }
    
    // Check if the immersive-ar session is supported
    navigator.xr.isSessionSupported('immersive-ar')
      .then(supported => {
        setXRSupported(supported);
        if (!supported) {
          toast.error("Your browser doesn't support AR sessions");
        }
      })
      .catch(err => {
        console.error("Error checking AR support:", err);
        setXRSupported(false);
      });
    
    // Get the pin from location state
    const pinData = location.state?.pin as MapPin | undefined;
    
    if (!pinData) {
      toast.error("No Phillboard data found");
      navigate('/');
      return;
    }
    
    setPin(pinData);
    
    // Cleanup function
    return () => {
      if (xrSession) {
        xrSession.end().catch(console.error);
      }
      
      if (xrState.current.renderer) {
        xrState.current.renderer.dispose();
      }
    };
  }, [location.state, navigate]);
  
  const startAR = async () => {
    if (!navigator.xr) {
      toast.error("Your browser doesn't support WebXR");
      return;
    }
    
    try {
      // Request an immersive AR session with hit-test
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      } as XRSessionInit);
      
      setXRSession(session);
      
      // Set up Three.js
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        canvas: canvasRef.current || undefined
      });
      renderer.xr.enabled = true;
      renderer.xr.setReferenceSpaceType('local');
      
      if (arContainerRef.current) {
        arContainerRef.current.appendChild(renderer.domElement);
      }
      
      await renderer.xr.setSession(session);
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera();
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 0);
      scene.add(directionalLight);
      
      // Store references
      xrState.current.renderer = renderer;
      xrState.current.scene = scene;
      xrState.current.camera = camera;
      
      // Get reference space
      xrState.current.xrRefSpace = await session.requestReferenceSpace('local');
      
      // Set up hit testing
      const viewerSpace = await session.requestReferenceSpace('viewer');
      xrState.current.hitTestSource = await session.requestHitTestSource({ 
        space: viewerSpace 
      });
      
      // Create a reticle to show where the phillboard will be placed
      const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32);
      reticleGeometry.rotateX(-Math.PI / 2);
      const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
      const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
      reticle.visible = false;
      scene.add(reticle);
      
      // Animation loop - called each frame of the AR session
      session.requestAnimationFrame(function onXRFrame(time, frame) {
        const pose = frame.getViewerPose(xrState.current.xrRefSpace!);
        
        if (pose) {
          // Update the reticle position based on hit test
          if (xrState.current.hitTestSource) {
            const hitTestResults = frame.getHitTestResults(xrState.current.hitTestSource);
            
            if (hitTestResults.length) {
              const hit = hitTestResults[0];
              const hitPose = hit.getPose(xrState.current.xrRefSpace!);
              
              if (hitPose) {
                // Store the hit position for placement
                xrState.current.hitPose = hitPose;
                setPlacementReady(true);
                
                // Update reticle position
                reticle.visible = true;
                reticle.position.set(
                  hitPose.transform.position.x,
                  hitPose.transform.position.y,
                  hitPose.transform.position.z
                );
                reticle.quaternion.copy(hitPose.transform.orientation as unknown as THREE.Quaternion);
              }
            } else {
              reticle.visible = false;
              setPlacementReady(false);
            }
          }
          
          // If we've placed a phillboard, ensure it's visible
          if (xrState.current.phillboardMesh) {
            xrState.current.phillboardMesh.visible = true;
          }
          
          // Render the scene
          renderer.render(scene, camera);
        }
        
        // Request next frame
        session.requestAnimationFrame(onXRFrame);
      });
      
      // Setup session end handler
      session.addEventListener('end', () => {
        setXRSession(null);
        setPlacementReady(false);
        
        if (arContainerRef.current && renderer.domElement) {
          arContainerRef.current.removeChild(renderer.domElement);
        }
        
        renderer.dispose();
        xrState.current = {
          renderer: null,
          scene: null,
          camera: null,
          hitTestSource: null,
          xrRefSpace: null,
          phillboardMesh: null,
          hitPose: null,
        };
      });
      
    } catch (err) {
      console.error("Error starting AR session:", err);
      toast.error("Failed to start AR session");
    }
  };
  
  const handleBack = () => {
    // End XR session if active
    if (xrSession) {
      xrSession.end().catch(console.error);
    }
    navigate('/');
  };
  
  const placePhillboard = async () => {
    if (!pin || !xrState.current.hitPose || !xrState.current.scene) {
      toast.error("Can't place phillboard - no valid position");
      return;
    }
    
    try {
      const hitPosition = xrState.current.hitPose.transform.position;
      
      // Create the phillboard mesh
      const geometry = new THREE.BoxGeometry(0.5, 0.3, 0.05);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        opacity: 0.7,
        transparent: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position at the hit test position
      mesh.position.set(
        hitPosition.x,
        hitPosition.y,
        hitPosition.z
      );
      mesh.quaternion.copy(xrState.current.hitPose.transform.orientation as unknown as THREE.Quaternion);
      
      // Add a text label using Canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 512;
        canvas.height = 256;
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 60px Arial';
        context.fillStyle = '#00FFFF';
        context.textAlign = 'center';
        context.fillText(pin.title, 256, 100);
        context.font = '40px Arial';
        context.fillStyle = '#FFFFFF';
        context.fillText(`@${pin.username}`, 256, 170);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true
        });
        const labelGeometry = new THREE.PlaneGeometry(0.5, 0.25);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 0, 0.03);
        mesh.add(label);
      }
      
      // Add to the scene
      xrState.current.scene.add(mesh);
      xrState.current.phillboardMesh = mesh;
      
      // Save the placement to Supabase if the user is authenticated
      if (user) {
        // Convert XR coordinates to GPS (simplified - you would need to provide real conversion)
        // In a real app, you would map the AR coordinate space to real-world lat/lng
        const estimatedLat = pin.lat + (Math.random() * 0.0001);
        const estimatedLng = pin.lng + (Math.random() * 0.0001);
        
        try {
          const newPhillboardData = {
            title: `AR Copy: ${pin.title}`,
            username: user.email?.split('@')[0] || "Anonymous",
            lat: estimatedLat,
            lng: estimatedLng,
            image_type: pin.image_type || 'text',
            content: `AR placed copy of ${pin.title}`,
            user_id: user.id
          };
          
          await createPhillboard(newPhillboardData);
          toast.success("Phillboard placed in AR and saved to database");
        } catch (error) {
          console.error("Error saving AR phillboard to database:", error);
          toast.error("Placed in AR but failed to save to database");
        }
      } else {
        toast.success("Phillboard placed in AR (demo mode)");
      }
      
    } catch (err) {
      console.error("Error placing phillboard:", err);
      toast.error("Failed to place phillboard");
    }
  };
  
  // If WebXR is not supported, show a fallback message
  if (xrSupported === false) {
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
      
      <div className="h-screen w-full" id="ar-container" ref={arContainerRef}>
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
      
      {/* AR Controls */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center">
        {!xrSession ? (
          <Button 
            className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-6 rounded-md"
            onClick={startAR}
            disabled={xrSupported === null || xrSupported === false}
          >
            {xrSupported === null ? "Checking AR Support..." : "Start AR Experience"}
          </Button>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-white mb-2 bg-black/60 px-4 py-1 rounded-full text-sm">
              {placementReady ? "Tap to place Phillboard" : "Point at a surface"}
            </p>
            <div className="flex gap-3">
              <Button 
                className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
                onClick={placePhillboard}
                disabled={!placementReady}
              >
                Place Here
              </Button>
              <Button 
                className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500"
                onClick={() => xrSession.end()}
              >
                Exit AR
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARView;
