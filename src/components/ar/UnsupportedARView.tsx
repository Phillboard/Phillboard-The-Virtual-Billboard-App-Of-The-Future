
import { Button } from "@/components/ui/button";

interface UnsupportedARViewProps {
  onBack: () => void;
}

/**
 * Component shown when AR is not supported on the current device
 */
const UnsupportedARView = ({ onBack }: UnsupportedARViewProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">WebXR Not Supported</h1>
      <p className="text-gray-300 mb-6">
        Your browser or device doesn't support WebXR AR sessions. 
        Please try using Chrome on an ARCore-supported Android device.
      </p>
      <Button onClick={onBack} className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan">
        Return to Map
      </Button>
    </div>
  );
};

export default UnsupportedARView;
