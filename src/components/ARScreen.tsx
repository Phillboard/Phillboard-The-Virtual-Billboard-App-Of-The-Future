
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useARSupport } from "./ar/hooks/useARSupport";
import { ARViewTabs } from "./ar/ARViewTabs";
import { AROptions } from "./ar/AROptions";
import ARDemo from "./ar/demo/ARDemo";

export function ARScreen() {
  const [activeView, setActiveView] = useState<string>("human");
  const [showARDemo, setShowARDemo] = useState(false);
  const navigate = useNavigate();
  const arSupported = useARSupport();
  
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
  
  return (
    <div className="screen relative bg-black p-0 h-full">
      <div className="absolute inset-0">
        <ARViewTabs activeView={activeView} onViewChange={setActiveView} />
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 space-y-4 w-64">
          <AROptions 
            onOptionSelect={handleAROptionSelect} 
            arSupported={arSupported} 
          />
        </div>
      </div>
    </div>
  );
}
