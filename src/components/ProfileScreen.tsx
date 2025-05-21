
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Fake user data
const userData = {
  name: "Alex Johnson",
  username: "cybernaut",
  email: "alex@example.com",
  phillboards: [
    { id: 1, title: "Digital Dreams", location: "Downtown", date: "May 15, 2025" },
    { id: 2, title: "Future Tech", location: "Tech Park", date: "May 10, 2025" },
    { id: 3, title: "Neon Vibes", location: "Metro Station", date: "May 5, 2025" },
  ],
};

export function ProfileScreen() {
  const [personMode, setPersonMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  const handleLogout = () => {
    toast.success("You've been logged out");
    // Would normally handle actual logout here
  };
  
  return (
    <div className="screen">
      <div className="space-y-6">
        {/* User Info Card */}
        <div className="neon-card p-6 rounded-lg text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-neon-cyan">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">AJ</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-gray-400">@{userData.username}</p>
          <p className="text-sm mt-1">{userData.email}</p>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline"
              className="text-sm bg-transparent border-white/20 hover:bg-white/10"
            >
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* My Phillboards */}
        <div>
          <h2 className="text-lg font-semibold mb-3">My Phillboards</h2>
          <div className="space-y-3">
            {userData.phillboards.map((item) => (
              <div key={item.id} className="neon-card p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neon-cyan">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 bg-transparent border-white/20 hover:bg-white/10"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {userData.phillboards.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>You haven't created any phillboards yet</p>
            </div>
          )}
        </div>
        
        {/* Settings */}
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
                onCheckedChange={setPersonMode}
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
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator className="bg-white/10" />
            
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
