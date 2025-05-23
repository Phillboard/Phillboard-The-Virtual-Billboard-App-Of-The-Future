
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileCard } from "./UserProfileCard";
import { UserBalance } from "./UserBalance";
import { useAuth } from "@/contexts/AuthContext";
import { LastUpdateBanner } from "../map/LastUpdateBanner";

interface ProfileHeaderProps {
  username: string;
  avatarUrl: string;
  onEditProfileClick: () => void;
}

export function ProfileHeader({ username, avatarUrl, onEditProfileClick }: ProfileHeaderProps) {
  const { user } = useAuth();
  
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
    
  return (
    <>
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
          onEditClick={onEditProfileClick}
        />
      </div>
    </>
  );
}
