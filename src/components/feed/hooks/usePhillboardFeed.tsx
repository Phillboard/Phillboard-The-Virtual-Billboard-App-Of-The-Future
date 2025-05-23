
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phillboard } from "../types";
import { toast } from "sonner";

export function usePhillboardFeed() {
  const [phillboards, setPhillboards] = useState<Phillboard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activityFeed, setActivityFeed] = useState<Array<{
    type: 'placement' | 'edit';
    phillboard: Phillboard;
    timestamp: string;
  }>>([]);

  // Fetch initial data and set up realtime subscription
  useEffect(() => {
    async function fetchPhillboards() {
      try {
        setIsLoading(true);
        
        // Get the latest phillboards, ordered by created_at
        const { data, error } = await supabase
          .from('phillboards')
          .select('*, phillboards_edit_history(count)')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        if (data) {
          // Process the data to include edit information
          const processedData = data.map(board => {
            // Fix: The phillboards_edit_history returns an array, so we need to 
            // access its first item to get the count
            const editHistory = board.phillboards_edit_history as any[];
            const editCount = editHistory && editHistory.length > 0 ? editHistory[0].count : 0;
            
            return {
              ...board,
              edit_count: editCount,
              is_edited: editCount > 0
            };
          });
          
          setPhillboards(processedData);
          
          // Create initial activity feed
          const initialFeed = processedData.map(board => ({
            type: 'placement' as const,
            phillboard: board,
            timestamp: board.created_at
          }));
          
          setActivityFeed(initialFeed);
        }
      } catch (error) {
        console.error("Error fetching phillboards:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPhillboards();
    
    // Set up realtime subscription for new phillboards and edits
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public', 
          table: 'phillboards'
        }, 
        (payload) => {
          console.log('New phillboard placement:', payload);
          // Add new phillboard to the top of the list
          const newPhillboard = payload.new as Phillboard;
          
          setPhillboards(currentPhillboards => {
            return [newPhillboard, ...currentPhillboards];
          });
          
          // Add to activity feed
          setActivityFeed(current => [{
            type: 'placement',
            phillboard: newPhillboard,
            timestamp: newPhillboard.created_at
          }, ...current]);
          
          toast.success(`New phillboard placed by @${newPhillboard.username}`);
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
          
          // Remove from activity feed
          setActivityFeed(current => {
            return current.filter(item => item.phillboard.id !== payload.old.id);
          });
          
          toast.info(`Phillboard deleted`);
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'phillboards'
        },
        (payload) => {
          console.log('Updated phillboard:', payload);
          const updatedPhillboard = payload.new as Phillboard;
          
          // Update the phillboard in the list
          setPhillboards(currentPhillboards => {
            return currentPhillboards.map(board => 
              board.id === updatedPhillboard.id ? 
              {...updatedPhillboard, is_edited: true, edit_count: (board.edit_count || 0) + 1} : 
              board
            );
          });
          
          // Add edit to activity feed
          setActivityFeed(current => [{
            type: 'edit',
            phillboard: {...updatedPhillboard, is_edited: true},
            timestamp: new Date().toISOString()
          }, ...current]);
          
          toast.info(`Phillboard edited by @${updatedPhillboard.username}`);
        }
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public', 
          table: 'phillboards_edit_history'
        },
        (payload) => {
          console.log('New edit history:', payload);
          // Find and update the related phillboard
          const editHistory = payload.new;
          const phillboardId = editHistory.phillboard_id;
          
          setPhillboards(currentPhillboards => {
            return currentPhillboards.map(board => 
              board.id === phillboardId ? 
              {...board, is_edited: true, edit_count: (board.edit_count || 0) + 1} : 
              board
            );
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    phillboards,
    setPhillboards,
    isLoading,
    activityFeed
  };
}
