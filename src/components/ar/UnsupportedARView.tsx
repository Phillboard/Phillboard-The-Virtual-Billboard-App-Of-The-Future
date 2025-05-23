
import { Button } from "@/components/ui/button";

interface UnsupportedARViewProps {
  onBack: () => void;
  onTryDemo: () => void;
}

/**
 * Component shown when AR is not supported on the current device
 * Updated to provide better options for users
 */
const UnsupportedARView = ({ onBack, onTryDemo }: UnsupportedARViewProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">WebXR Not Supported</h1>
      <p className="text-gray-300 mb-6">
        Your browser or device doesn't support WebXR AR sessions.
      </p>
      <div className="flex flex-col gap-4 w-64">
        <Button 
          onClick={onTryDemo} 
          className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold w-full py-3"
        >
          Try Universal AR Demo
        </Button>
        <p className="text-xs text-center text-white/70 mb-2">
          The demo works on all devices!
        </p>
        <Button onClick={onBack} className="bg-black/60 hover:bg-black/40 text-white border border-white/20">
          Return to Map
        </Button>
      </div>
    </div>
  );
};

export default UnsupportedARView;
