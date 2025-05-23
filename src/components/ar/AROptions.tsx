
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
  
  if (!arSupported) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="bg-black/60 text-red-400 border border-red-900 py-2 px-4 rounded-md text-center">
          AR not supported on this device.<br/>
          <span className="text-xs text-white/50">Try Chrome on Android</span>
        </div>
        
        {/* Prominent Demo Button for non-supported devices */}
        <Button 
          onClick={() => onOptionSelect('demo')}
          className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold w-full py-3"
        >
          Try Universal AR Demo
        </Button>
        <div className="text-xs text-center text-white/70">
          The demo works on all devices!
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan w-full"
          >
            AR Options <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 border border-neon-cyan/30 text-white">
          <DropdownMenuItem 
            onClick={() => onOptionSelect('demo')}
            className="hover:bg-neon-cyan/20 cursor-pointer"
          >
            Test AR (Universal Demo)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onOptionSelect('webxr')}
            className="hover:bg-neon-cyan/20 cursor-pointer"
          >
            WebXR AR Experience
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
