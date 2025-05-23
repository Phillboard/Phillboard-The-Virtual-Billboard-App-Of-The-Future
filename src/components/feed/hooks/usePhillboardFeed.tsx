
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phillboard } from "../types";

export function usePhillboardFeed() {
  const [phillboards, setPhillboards] = useState<Phillboard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  return {
    phillboards,
    setPhillboards,
    isLoading
  };
}
