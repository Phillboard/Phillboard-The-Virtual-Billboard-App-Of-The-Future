
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
  initialUsername: string;
  initialAvatarUrl: string;
}

export function EditProfileDialog({
  isOpen,
  onOpenChange,
  userId,
  initialUsername,
  initialAvatarUrl
}: EditProfileDialogProps) {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleProfileUpdate = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId,
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
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
}
