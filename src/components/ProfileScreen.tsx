
import { useProfileData } from "./profile/hooks/useProfileData";
import { useProfileSettings } from "./profile/hooks/useProfileSettings";
import { ProfileHeader } from "./profile/ProfileHeader";
import { UserPhillboardsList } from "./profile/UserPhillboardsList";
import { UserSettings } from "./profile/UserSettings";
import { EditProfileDialog } from "./profile/EditProfileDialog";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileScreen() {
  const { user } = useAuth();
  const {
    username,
    avatarUrl,
    phillboards,
    isEditDialogOpen,
    setIsEditDialogOpen
  } = useProfileData();
  
  const {
    personMode,
    setPersonMode,
    notifications,
    setNotifications,
    signOut
  } = useProfileSettings();
  
  return (
    <div className="screen relative">
      <ProfileHeader 
        username={username} 
        avatarUrl={avatarUrl}
        onEditProfileClick={() => setIsEditDialogOpen(true)}
      />
      
      <div className="space-y-6 mt-6">
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
