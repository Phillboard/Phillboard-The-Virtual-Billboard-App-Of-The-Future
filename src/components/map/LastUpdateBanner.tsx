
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function LastUpdateBanner() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('last_update_time')
          .single();
          
        if (error) throw error;
        
        if (data?.last_update_time) {
          setLastUpdate(new Date(data.last_update_time));
        }
      } catch (error) {
        console.error("Error fetching last update time:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLastUpdate();
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        {
          event: 'UPDATE', 
          schema: 'public', 
          table: 'app_settings'
        }, 
        (payload) => {
          if (payload.new && payload.new.last_update_time) {
            setLastUpdate(new Date(payload.new.last_update_time));
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading || !lastUpdate) return null;

  return (
    <div className="bg-black/60 backdrop-blur-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm text-white/80 border border-white/10 mb-4">
      <Clock className="h-4 w-4 text-neon-cyan" />
      <span>
        Last updated: {format(lastUpdate, "MMM d, yyyy 'at' h:mm a")}
      </span>
    </div>
  );
}
