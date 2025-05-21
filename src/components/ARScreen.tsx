
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ARScreen() {
  const [isPersonMode, setIsPersonMode] = useState(false);
  const [showPlacement, setShowPlacement] = useState(false);
  
  const togglePersonMode = () => {
    setIsPersonMode(!isPersonMode);
    toast.success(isPersonMode ? "Switched to location mode" : "Switched to person mode");
  };
  
  const handleScreenTap = () => {
    setShowPlacement(true);
  };
  
  const handleCancel = () => {
    setShowPlacement(false);
  };
  
  const handlePlace = () => {
    toast.success("Phillboard placed successfully!");
    setShowPlacement(false);
  };
  
  return (
    <div 
      className="screen relative bg-black p-0"
      onClick={() => !showPlacement && handleScreenTap()}
    >
      {/* Simulated camera view */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-gray-800"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 20%, rgba(0, 255, 255, 0.05), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 0, 255, 0.05), transparent 40%)"
          }}
        >
          {/* Grid lines to simulate AR space */}
          <div className="absolute inset-0 opacity-30" style={{ 
            backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), 
                              linear-gradient(to right, rgba(0, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            perspectiveOrigin: 'center',
            perspective: '500px',
            transform: 'rotateX(60deg)',
            transformStyle: 'preserve-3d',
          }}></div>
          
          {/* AR Phillboards */}
          <div className="absolute left-[30%] top-[40%] transform -translate-x-1/2 -translate-y-1/2 animate-float">
            <div className="phillboard w-40 rotate-3 shadow-neon-cyan">
              <div className="text-center">
                <h3 className="text-neon-cyan mb-1">Tech Hub</h3>
                <p className="text-sm text-white/70">by @NeonRider</p>
              </div>
            </div>
          </div>
          
          <div className="absolute right-[10%] top-[30%] transform -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '1s' }}>
            <div className="phillboard w-32 -rotate-6 shadow-neon-magenta">
              <div className="text-center">
                <h3 className="text-neon-magenta mb-1">Future Now</h3>
                <p className="text-sm text-white/70">by @DigitalNomad</p>
              </div>
            </div>
          </div>
          
          {/* Person mode phillboard */}
          {isPersonMode && (
            <div className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 mb-2 border border-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <circle cx="12" cy="8" r="5"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </div>
                <div className="phillboard w-28 shadow-neon-cyan animate-float">
                  <div className="text-center">
                    <h3 className="text-neon-cyan mb-1">CoffeeNerd</h3>
                    <p className="text-xs text-white/70">Tap to view</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* AR HUD Overlay */}
      <div className="relative z-10 p-4">
        {/* Top HUD */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
              <path d="M22 15.5V11a2 2 0 0 0-1.95-2 1.5 1.5 0 0 1-1.5-1.73 1.95 1.95 0 0 0-3.8-.27A1.5 1.5 0 0 1 13 8.5h-3a1.5 1.5 0 0 1-1.5-1.5 2 2 0 0 0-4 0 1.5 1.5 0 0 1-1.5 1.5 2 2 0 0 0-2 2v4.5"/>
              <path d="M2 15.5a3.5 3.5 0 0 0 3.5 3.5h13a3.5 3.5 0 0 0 3.5-3.5"/>
              <path d="M12 16.5V10"/>
              <path d="m9 13 3 3 3-3"/>
            </svg>
            <span className="text-xs">N</span>
          </div>
          
          <button
            onClick={togglePersonMode}
            className={`p-2 rounded-full ${isPersonMode ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan' : 'bg-black/40 backdrop-blur-sm'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
            </svg>
          </button>
          
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xs">3 nearby</span>
          </div>
        </div>
      </div>
      
      {/* Placement UI */}
      {showPlacement && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {/* Placement indicator */}
          <div className="phillboard w-40 shadow-neon-cyan bg-black/80">
            <div className="text-center">
              <h3 className="text-neon-cyan mb-1">New Phillboard</h3>
              <p className="text-sm text-white/70">Tap to place here</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="absolute bottom-24 w-full flex justify-center gap-4 p-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 max-w-[120px] bg-black/60 border-white/20 hover:bg-black/80"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlace}
              className="flex-1 max-w-[120px] bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
            >
              Place
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
