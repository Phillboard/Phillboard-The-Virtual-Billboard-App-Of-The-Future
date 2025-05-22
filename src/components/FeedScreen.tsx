
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { DeletePinDialog } from "./map/dialogs/DeletePinDialog";
import { MapPin } from "./map/types";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Phillboard {
  id: string;
  title: string;
  username: string;
  created_at: string;
  image_type: string;
  content: string | null;
  lat: number;
  lng: number;
}

export function FeedScreen() {
  const [phillboards, setPhillboards] = useState<Phillboard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAdmin } = useAuth();
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
  
  // Format the created_at date to a relative time (e.g., "5 minutes ago")
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  // Get approximate location description based on coordinates
  const getLocationDescription = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  // Check if user can delete this phillboard
  const canDeletePhillboard = (phillboard: Phillboard) => {
    return isAdmin(user) || (user?.user_metadata?.username === phillboard.username);
  };

  // Handle delete button click
  const handleDeleteClick = (phillboard: Phillboard) => {
    // Convert Phillboard to MapPin format
    const selectedPin: MapPin = {
      id: phillboard.id,
      lat: phillboard.lat,
      lng: phillboard.lng,
      title: phillboard.title,
      username: phillboard.username,
      distance: "nearby", // Placeholder for distance
      image_type: phillboard.image_type,
      content: phillboard.content
    };
    
    setSelectedPin(selectedPin);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="screen p-4 pb-24 pt-8 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400">Recent Activity</h1>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-800 bg-black/60 animate-pulse">
                <div className="w-1/2 h-4 bg-gray-800 rounded mb-3"></div>
                <div className="w-3/4 h-3 bg-gray-800 rounded mb-2"></div>
                <div className="w-1/3 h-3 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : phillboards.length > 0 ? (
          phillboards.map((phillboard) => (
            <div 
              key={phillboard.id} 
              className="p-4 rounded-lg border border-gray-800 bg-black/60 transition-all hover:border-cyan-900"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-cyan-400">{phillboard.title}</h3>
                <div className="flex items-center gap-2">
                  {canDeletePhillboard(phillboard) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                      onClick={() => handleDeleteClick(phillboard)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                  <span className="text-xs text-gray-400">{formatTime(phillboard.created_at)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-2">
                by <span className="text-fuchsia-500">@{phillboard.username}</span>
              </p>
              
              {phillboard.image_type && phillboard.image_type !== 'text' && (
                <div className="bg-gray-900 rounded h-24 flex items-center justify-center mb-2">
                  <span className="text-xs text-gray-500">{phillboard.image_type} content</span>
                </div>
              )}
              
              {phillboard.content && (
                <p className="text-sm text-gray-300 mb-2 italic">"{phillboard.content}"</p>
              )}
              
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{getLocationDescription(phillboard.lat, phillboard.lng)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No phillboards have been placed yet.</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to place one!</p>
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
    </div>
  );
}
