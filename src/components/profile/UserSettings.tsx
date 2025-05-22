
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface UserSettingsProps {
  personMode: boolean;
  notifications: boolean;
  onPersonModeChange: (value: boolean) => void;
  onNotificationsChange: (value: boolean) => void;
  onSignOut: () => void;
}

export function UserSettings({
  personMode,
  notifications,
  onPersonModeChange,
  onNotificationsChange,
  onSignOut
}: UserSettingsProps) {
  return (
    <div className="neon-card p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="person-mode" className="font-medium">AR Person Mode</Label>
            <p className="text-sm text-gray-400">Show phillboards above people's heads</p>
          </div>
          <Switch 
            id="person-mode"
            checked={personMode}
            onCheckedChange={onPersonModeChange}
          />
        </div>
        
        <Separator className="bg-white/10" />
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notifications" className="font-medium">Notifications</Label>
            <p className="text-sm text-gray-400">Get notified when someone overwrites your sign</p>
          </div>
          <Switch 
            id="notifications"
            checked={notifications}
            onCheckedChange={onNotificationsChange}
          />
        </div>
        
        <Separator className="bg-white/10" />
        
        <Button 
          onClick={onSignOut}
          variant="destructive"
          className="w-full"
        >
          Logout
        </Button>
        
        <Link to="/admin" className="block mt-4">
          <Button 
            variant="outline"
            className="w-full bg-transparent border-white/20 hover:bg-white/10 text-neon-cyan"
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Panel
          </Button>
        </Link>
      </div>
    </div>
  );
}
