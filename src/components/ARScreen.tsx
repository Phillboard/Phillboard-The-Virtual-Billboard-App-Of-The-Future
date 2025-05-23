import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { checkARSupport } from "@/utils/arUtils";
import { useNavigate } from "react-router-dom";
import HumanARView from "@/components/ar/HumanARView";
import BillboardARView from "@/components/ar/BillboardARView";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import ARDemo from "@/components/ar/demo/ARDemo";

// WebXR Button Component
function WebXRButton() {
  const navigate = useNavigate();
  const handleLaunchAR = async () => {
    try {
      // Check if WebXR is supported
      const isSupported = await checkARSupport();
      
      if (isSupported) {
        toast.success("Launching AR experience");
        // Navigate to the dedicated AR view
        navigate('/ar-view');
      } else {
        toast.warning("AR not supported on your device");
      }
    } catch (error) {
      console.error("Error launching AR:", error);
      toast.error("Failed to launch AR experience");
    }
  };

  return (
    <Button 
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
      onClick={handleLaunchAR}
    >
      Launch AR Experience
    </Button>
  );
}

// Main ARScreen Component
export function ARScreen() {
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  const [activeView, setActiveView] = useState<string>("human");
  const [showARDemo, setShowARDemo] = useState(false);
  const navigate = useNavigate();
  
  // Check AR support on component mount
  useEffect(() => {
    checkARSupport().then(setARSupported);
  }, []);

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
        <Tabs 
          defaultValue="human" 
          className="w-full" 
          onValueChange={setActiveView}
        >
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg py-1 px-1 rounded-full z-20">
            <TabsList className="bg-black/20 backdrop-blur-sm">
              <TabsTrigger 
                value="human"
                className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white"
              >
                Human View
              </TabsTrigger>
              <TabsTrigger 
                value="billboard"
                className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white"
              >
                Billboard View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="human" className="h-full mt-0">
            <HumanARView />
          </TabsContent>
          
          <TabsContent value="billboard" className="h-full mt-0">
            <BillboardARView />
          </TabsContent>
        </Tabs>
        
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 space-y-4 w-64">
          {arSupported === null ? (
            <div className="bg-black/40 text-white/50 border border-white/10 py-2 px-4 rounded-md text-center">
              Checking AR Support...
            </div>
          ) : arSupported ? (
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
                    onClick={() => handleAROptionSelect('demo')}
                    className="hover:bg-neon-cyan/20 cursor-pointer"
                  >
                    Test AR (Universal Demo)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleAROptionSelect('webxr')}
                    className="hover:bg-neon-cyan/20 cursor-pointer"
                  >
                    WebXR AR Experience
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
                onClick={() => toast.info(`Place ${activeView === "human" ? "Human" : "Billboard"} Phillboard`)}
              >
                Place {activeView === "human" ? "Human" : "Billboard"} Phillboard
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <div className="bg-black/60 text-red-400 border border-red-900 py-2 px-4 rounded-md text-center">
                AR not supported on this device.<br/>
                <span className="text-xs text-white/50">Try Chrome on Android</span>
              </div>
              
              {/* Prominent Demo Button for non-supported devices */}
              <Button 
                onClick={() => setShowARDemo(true)}
                className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold w-full py-3"
              >
                Try Universal AR Demo
              </Button>
              <div className="text-xs text-center text-white/70">
                The demo works on all devices!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
