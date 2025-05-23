
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DeletePinDialog } from "./map/dialogs/DeletePinDialog";
import { UserProfileDialog } from "./profile/UserProfileDialog";
import { toast } from "sonner";
import { Phillboard, convertToMapPin } from "./feed/types";
import { PhillboardItem } from "./feed/PhillboardItem";
import { LoadingState } from "./feed/LoadingState";
import { EmptyState } from "./feed/EmptyState";

export function FeedScreen() {
  const [phillboards, setPhillboards] = useState<Phillboard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAdmin } = useAuth();
  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  
  // Fetch initial data and set up realtime subscription
  useEffect(() => {
    async function fetchPhillboards() {
      try {
        setIsLoading(true);
        
        // Get the latest phillboards, ordered by created_at
        const { data, error } = await supabase
          .from('phillboards')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        if (data) {
          setPhillboards(data);
        }
      } catch (error) {
        console.error("Error fetching phillboards:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPhillboards();
    
    // Set up realtime subscription for new phillboards
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public', 
          table: 'phillboards'
        }, 
        (payload) => {
          console.log('New phillboard:', payload);
          // Add new phillboard to the top of the list
          setPhillboards(currentPhillboards => {
            const newPhillboard = payload.new as Phillboard;
            return [newPhillboard, ...currentPhillboards];
          });
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'phillboards'
        },
        (payload) => {
          console.log('Deleted phillboard:', payload);
          // Remove deleted phillboard from the list
          setPhillboards(currentPhillboards => {
            return currentPhillboards.filter(board => board.id !== payload.old.id);
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
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

  return (
    <div className="screen p-4 pb-24 pt-8 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400">Recent Activity</h1>
      
      <div className="space-y-4">
        {isLoading ? (
          <LoadingState />
        ) : phillboards.length > 0 ? (
          phillboards.map((phillboard) => (
            <PhillboardItem
              key={phillboard.id}
              phillboard={phillboard}
              canDelete={canDeletePhillboard(phillboard)}
              onDeleteClick={handleDeleteClick}
              onUsernameClick={handleUsernameClick}
            />
          ))
        ) : (
          <EmptyState />
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
    </div>
  );
}
