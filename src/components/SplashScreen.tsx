
import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Give time for exit animation
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-500 ${animationComplete ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-xl bg-black border-2 border-neon-cyan shadow-neon-cyan flex items-center justify-center">
            <span className="text-4xl font-bold tracking-tighter text-neon-cyan">P</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-magenta rounded-full shadow-neon-magenta animate-pulse"></div>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">
          <span className="text-neon-cyan">Phill</span>
          <span className="text-neon-magenta">Board</span>
        </h1>
        <p className="text-sm text-gray-400">Tag the world around you</p>
      </div>
    </div>
  );
}
