
import { ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface AdminModeToggleProps {
  isAdminMode: boolean;
  isAdmin: boolean;
  onToggle: () => void;
}

export function AdminModeToggle({ isAdminMode, isAdmin, onToggle }: AdminModeToggleProps) {
  if (!isAdmin) return null;
  
  return (
    <div className="absolute top-16 right-4 z-10">
      <Button 
        variant={isAdminMode ? "destructive" : "secondary"}
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-1 text-xs font-medium"
      >
        <ShieldCheck className="size-4" />
        {isAdminMode ? "Admin Mode: ON" : "Admin Mode: OFF"}
      </Button>
    </div>
  );
}
