
import { Button } from "@/components/ui/button";

interface AROptionsProps {
  onOptionSelect: (option: string) => void;
  arSupported: boolean | null;
}

export function AROptions({ onOptionSelect, arSupported }: AROptionsProps) {
  if (arSupported === null) {
    return (
      <div className="bg-black/40 text-white/50 border border-white/10 py-2 px-4 rounded-md text-center">
        Checking AR Support...
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      {arSupported && (
        <Button 
          onClick={() => onOptionSelect('webxr')}
          className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan w-full"
        >
          Start WebXR Experience
        </Button>
      )}
      
      <Button 
        onClick={() => onOptionSelect('demo')}
        className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold w-full py-3"
      >
        Try Universal AR Demo
      </Button>
      
      {!arSupported && (
        <div className="text-xs text-center text-white/70">
          The demo works on all devices!
        </div>
      )}
    </div>
  );
}
