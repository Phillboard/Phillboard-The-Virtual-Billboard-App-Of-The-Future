
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onClick: () => void;
}

/**
 * Navigation back button for the AR view
 */
const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Button onClick={onClick} variant="outline" className="bg-black/60 border-white/20">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </Button>
  );
};

export default BackButton;
