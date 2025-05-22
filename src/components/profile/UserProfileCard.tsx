
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface UserProfileCardProps {
  displayName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  onEditClick: () => void;
}

export function UserProfileCard({
  displayName,
  username,
  email,
  avatarUrl,
  initials,
  onEditClick
}: UserProfileCardProps) {
  return (
    <div className="neon-card p-6 rounded-lg text-center">
      <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-neon-cyan">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} />
        <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">{initials}</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold">{displayName}</h1>
      <p className="text-gray-400">@{username || "user"}</p>
      <p className="text-sm mt-1">{email}</p>
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline"
          className="text-sm bg-transparent border-white/20 hover:bg-white/10"
          onClick={onEditClick}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
