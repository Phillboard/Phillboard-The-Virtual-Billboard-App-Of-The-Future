
import { useState } from "react";
import { Phillboard, convertToMapPin } from "./types";
import { PhillboardItem } from "./PhillboardItem";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { DeletePinDialog } from "../map/dialogs/DeletePinDialog";
import { UserProfileDialog } from "../profile/UserProfileDialog";
import { SearchAndFilter } from "../search/SearchAndFilter";
import { usePhillboardFiltering } from "@/hooks/usePhillboardFiltering";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityItem } from "./ActivityItem";

interface FeedContentProps {
  phillboards: Phillboard[];
  isLoading: boolean;
  activityFeed?: Array<{
    type: 'placement' | 'edit';
    phillboard: Phillboard;
    timestamp: string;
  }>;
}

export function FeedContent({ phillboards, isLoading, activityFeed = [] }: FeedContentProps) {
  const { user, isAdmin } = useAuth();
  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  
  // Use filtering hook for the appropriate data source
  const dataToFilter = activityFeed && activityFeed.length > 0 
    ? activityFeed.map(activity => activity.phillboard)
    : phillboards;
    
  const {
    filteredItems,
    setSearchQuery,
    setFilters,
    hasActiveFilters
  } = usePhillboardFiltering(dataToFilter);
  
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

  return (
    <>
      <div className="space-y-4">
        {/* Search and Filter Controls */}
        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          searchPlaceholder="Search phillboards, users, content..."
        />
        
        {/* Results count */}
        {hasActiveFilters && (
          <div className="text-sm text-gray-400">
            Showing {filteredItems.length} of {dataToFilter.length} phillboards
          </div>
        )}
        
        {/* Results */}
        {filteredItems.length === 0 ? (
          hasActiveFilters ? (
            <div className="text-center py-8 text-gray-400">
              <p>No phillboards match your search criteria</p>
              <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="space-y-4">
            {activityFeed && activityFeed.length > 0 ? (
              // Render activity feed if available - match filtered items back to activities
              activityFeed
                .filter(activity => filteredItems.includes(activity.phillboard))
                .map((activity, index) => (
                  <ActivityItem
                    key={`${activity.phillboard.id}-${index}`}
                    activity={activity}
                    canDelete={canDeletePhillboard(activity.phillboard)}
                    onDeleteClick={handleDeleteClick}
                    onUsernameClick={handleUsernameClick}
                  />
                ))
            ) : (
              // Fall back to standard phillboard list
              filteredItems.map((phillboard) => (
                <PhillboardItem
                  key={phillboard.id}
                  phillboard={phillboard}
                  canDelete={canDeletePhillboard(phillboard)}
                  onDeleteClick={handleDeleteClick}
                  onUsernameClick={handleUsernameClick}
                />
              ))
            )}
          </div>
        )}
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
