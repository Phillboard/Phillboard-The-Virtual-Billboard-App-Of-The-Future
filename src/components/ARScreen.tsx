
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useARSupport } from "./ar/hooks/useARSupport";
import { ARViewTabs } from "./ar/ARViewTabs";
import ARDemo from "./ar/demo/ARDemo";
import UnsupportedARView from "./ar/UnsupportedARView";

export function ARScreen() {
  const [activeView, setActiveView] = useState<string>("human");
  const [showARDemo, setShowARDemo] = useState(false);
  const navigate = useNavigate();
  const arSupported = useARSupport();
  
  // Auto-show demo if AR is not supported
  useEffect(() => {
    if (arSupported === false) {
      setShowARDemo(true);
    }
  }, [arSupported]);
  
  const handleAROptionSelect = (option: string) => {
    if (option === 'demo') {
      setShowARDemo(true);
    } else if (option === 'webxr') {
      navigate('/ar-view');
    }
  };
  
  if (showARDemo) {
    return (
      <div className="screen relative bg-black p-0 h-full">
        <ARDemo onBack={() => setShowARDemo(false)} />
      </div>
    );
  }
  
  if (arSupported === false) {
    return (
      <div className="screen relative bg-black p-0 h-full">
        <UnsupportedARView 
          onBack={() => navigate('/')}
          onTryDemo={() => setShowARDemo(true)}
        />
      </div>
    );
  }
  
  return (
    <div className="screen relative bg-black p-0 h-full">
      <div className="absolute inset-0">
        <ARViewTabs activeView={activeView} onViewChange={setActiveView} />
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 space-y-4 w-64">
          {arSupported && (
            <button
              onClick={() => handleAROptionSelect('webxr')}
              className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan w-full py-3 px-4 rounded"
            >
              Start WebXR Experience
            </button>
          )}
          
          <button
            onClick={() => handleAROptionSelect('demo')}
            className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold w-full py-3 px-4 rounded"
          >
            Try Universal AR Demo
          </button>
        </div>
      </div>
    </div>
  );
}
