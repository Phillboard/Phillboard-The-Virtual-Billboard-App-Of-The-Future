
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Shield, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LastUpdateBanner } from "./map/LastUpdateBanner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin } from "./map/types";
import { fetchUserPhillboards } from "@/services/phillboardService";

// Create interface for user phillboards
interface Phillboard extends MapPin {
  date: string;
}

export function ProfileScreen() {
  const [personMode, setPersonMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { user, signOut } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phillboards, setPhillboards] = useState<Phillboard[]>([]);
  
  // Get username or email for display
  const displayName = user?.user_metadata?.username || user?.email || "User";
  const email = user?.email || "";
  
  // Create initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Fetch user's phillboards
  useEffect(() => {
    const loadPhillboards = async () => {
      if (!user) return;
      
      try {
        const pins = await fetchUserPhillboards(user.id);
        
        // Convert pins to Phillboard format
        const formattedPhillboards: Phillboard[] = pins.map(pin => ({
          ...pin,
          date: new Date(pin.created_at || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));
        
        setPhillboards(formattedPhillboards);
      } catch (error) {
        console.error("Error loading phillboards:", error);
      }
    };
    
    loadPhillboards();
  }, [user]);
  
  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setUsername(data.username || user.user_metadata?.username || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    
    loadProfile();
  }, [user]);
  
  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update user metadata
      await supabase.auth.updateUser({
        data: { username }
      });
      
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="screen relative">
      {/* Last Update Banner */}
      <LastUpdateBanner />
      
      <div className="space-y-6 mt-8">
        {/* User Info Card */}
        <div className="neon-card p-6 rounded-lg text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-neon-cyan">
            <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-gray-400">@{username || user?.user_metadata?.username || "user"}</p>
          <p className="text-sm mt-1">{email}</p>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline"
              className="text-sm bg-transparent border-white/20 hover:bg-white/10"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* My Phillboards */}
        <div>
          <h2 className="text-lg font-semibold mb-3">My Phillboards</h2>
          <div className="space-y-3">
            {phillboards.map((item) => (
              <div key={item.id} className="neon-card p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neon-cyan">{item.title}</h3>
                    <p className="text-sm text-gray-400">{`${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}`}</p>
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
          
          {phillboards.length === 0 && (
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
              onClick={signOut}
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
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogTitle>Edit Profile</DialogTitle>
          
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-gray-900 border-white/20 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="bg-gray-900 border-white/20 mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-transparent border-white/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="bg-neon-cyan hover:bg-neon-cyan/90 text-black"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
