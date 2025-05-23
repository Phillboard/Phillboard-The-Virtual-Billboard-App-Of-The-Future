
import { useState } from "react";
import { Phillboard, convertToMapPin } from "./types";
import { PhillboardItem } from "./PhillboardItem";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { DeletePinDialog } from "../map/dialogs/DeletePinDialog";
import { UserProfileDialog } from "../profile/UserProfileDialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface FeedContentProps {
  phillboards: Phillboard[];
  isLoading: boolean;
}

export function FeedContent({ phillboards, isLoading }: FeedContentProps) {
  const { user, isAdmin } = useAuth();
  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  
  // Check if user can delete this phillboard
  const canDeletePhillboard = (phillboard: Phillboard) => {
    return isAdmin(user) || (user?.user_metadata?.username === phillboard.username);
  };

  // Handle delete button click
  const handleDeleteClick = (phillboard: Phillboard) => {
    const mapPin = convertToMapPin(phillboard);
    setSelectedPin(mapPin);
    setIsDeleteDialogOpen(true);
  };

  // Handle username click to open profile dialog
  const handleUsernameClick = (username: string) => {
    setSelectedUsername(username);
    setIsProfileDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }
  
  if (phillboards.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="space-y-4">
        {phillboards.map((phillboard) => (
          <PhillboardItem
            key={phillboard.id}
            phillboard={phillboard}
            canDelete={canDeletePhillboard(phillboard)}
            onDeleteClick={handleDeleteClick}
            onUsernameClick={handleUsernameClick}
          />
        ))}
      </div>
      
      {/* Delete confirmation dialog */}
      <DeletePinDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedPin={selectedPin}
        onDeleteSuccess={() => {
          toast.success("Phillboard deleted successfully");
          setSelectedPin(null);
        }}
      />
      
      {/* User profile dialog */}
      <UserProfileDialog
        isOpen={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        username={selectedUsername}
      />
    </>
  );
}
