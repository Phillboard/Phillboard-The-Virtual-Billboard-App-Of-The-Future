
import React from 'react';
import { useThree } from '@react-three/fiber';
import { Button } from "@/components/ui/button";

interface CustomARButtonProps {
  className?: string;
}

export function CustomARButton({ className }: CustomARButtonProps) {
  const { gl } = useThree();
  const [isPresenting, setIsPresenting] = React.useState(false);

  React.useEffect(() => {
    // Check current session status on mount and when it changes
    const checkSession = () => {
      setIsPresenting(!!gl.xr.getSession());
    };
    
    // Set up event listeners for session changes
    gl.xr.addEventListener('sessionstart', checkSession);
    gl.xr.addEventListener('sessionend', checkSession);
    
    // Initial check
    checkSession();
    
    return () => {
      gl.xr.removeEventListener('sessionstart', checkSession);
      gl.xr.removeEventListener('sessionend', checkSession);
    };
  }, [gl.xr]);

  const toggleAR = async () => {
    try {
      const currentSession = gl.xr.getSession();
      
      if (currentSession) {
        await currentSession.end();
      } else {
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test', 'dom-overlay'],
          domOverlay: { root: document.body }
        });
        await gl.xr.setSession(session);
      }
    } catch (error) {
      console.error('AR session error:', error);
    }
  };

  return (
    <Button 
      onClick={toggleAR}
      className={`bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md ${className || ''}`}
    >
      {isPresenting ? "Exit AR" : "Enter AR"}
    </Button>
  );
}

export default CustomARButton;
