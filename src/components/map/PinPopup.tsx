
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin } from "./types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PinPopupProps {
  selectedPin: MapPin | null;
  onClose: () => void;
}

export function PinPopup({ selectedPin, onClose }: PinPopupProps) {
  const navigate = useNavigate();
  
  if (!selectedPin) return null;
  
  const handleViewInAR = () => {
    toast.success(`Launching AR view for "${selectedPin.title}"`);
    navigate('/ar-view', { state: { pin: selectedPin } });
    onClose();
  };
  
  const handleOverwrite = () => {
    toast.info("Overwrite feature coming soon!");
    onClose();
  };
  
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-20 animate-fade-in">
      <Card className="neon-card">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">{selectedPin.title}</h3>
              <p className="text-sm text-gray-400">by @{selectedPin.username}</p>
            </div>
            <div className="flex items-center text-sm text-neon-cyan">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {selectedPin.distance}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-md h-32 mb-4 flex items-center justify-center">
            <div className="text-neon-cyan text-4xl">Aa</div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
              onClick={handleViewInAR}
            >
              View in AR
            </Button>
            <Button 
              className="flex-1 bg-neon-magenta/20 hover:bg-neon-magenta/30 text-white border border-neon-magenta"
              onClick={handleOverwrite}
              disabled
            >
              Overwrite
            </Button>
          </div>
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
