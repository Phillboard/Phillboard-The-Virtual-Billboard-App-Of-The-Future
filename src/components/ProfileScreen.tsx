
import { useState, useEffect } from "react";
import { LastUpdateBanner } from "./map/LastUpdateBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserPhillboards } from "@/services/phillboardService";
import { UserProfileCard } from "./profile/UserProfileCard";
import { UserPhillboardsList } from "./profile/UserPhillboardsList";
import { UserSettings } from "./profile/UserSettings";
import { EditProfileDialog } from "./profile/EditProfileDialog";
import { UserBalance } from "./profile/UserBalance";
import { Phillboard } from "./profile/types";

export function ProfileScreen() {
  const [personMode, setPersonMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { user, signOut } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
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
  
  return (
    <div className="screen relative">
      {/* Last Update Banner */}
      <LastUpdateBanner />
      
      <div className="space-y-6 mt-8">
        {/* User Balance */}
        <UserBalance />
        
        <UserProfileCard 
          displayName={displayName}
          username={username || user?.user_metadata?.username || "user"}
          email={email}
          avatarUrl={avatarUrl || user?.user_metadata?.avatar_url}
          initials={initials}
          onEditClick={() => setIsEditDialogOpen(true)}
        />
        
        <UserPhillboardsList phillboards={phillboards} />
        
        <UserSettings
          personMode={personMode}
          notifications={notifications}
          onPersonModeChange={setPersonMode}
          onNotificationsChange={setNotifications}
          onSignOut={signOut}
        />
      </div>
      
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        userId={user?.id}
        initialUsername={username}
        initialAvatarUrl={avatarUrl}
      />
    </div>
  );
}
