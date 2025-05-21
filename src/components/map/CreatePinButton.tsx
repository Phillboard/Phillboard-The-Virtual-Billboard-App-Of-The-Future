
import { Button } from "@/components/ui/button";

interface CreatePinButtonProps {
  onClick: () => void;
}

export function CreatePinButton({ onClick }: CreatePinButtonProps) {
  return (
    <Button 
      className="fixed right-6 bottom-24 w-14 h-14 bg-neon-cyan text-black rounded-full flex items-center justify-center shadow-neon-cyan z-20"
      onClick={onClick}
      size="icon"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      </svg>
    </Button>
  );
}
