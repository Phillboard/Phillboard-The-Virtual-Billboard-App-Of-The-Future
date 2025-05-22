
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarClock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function UpdateTimestampSection() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Fetch the current timestamp on component mount
  useState(() => {
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
      }
    };
    
    fetchLastUpdate();
  }, []);

  const updateTimestamp = async () => {
    try {
      setIsUpdating(true);
      const now = new Date();
      
      const { error } = await supabase
        .from('app_settings')
        .update({ last_update_time: now.toISOString() })
        .eq('id', 1);  // Assuming there's only one settings row with id=1
      
      if (error) throw error;
      
      setLastUpdate(now);
      toast.success("Update timestamp set successfully");
    } catch (error) {
      console.error("Error updating timestamp:", error);
      toast.error("Failed to update timestamp");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="p-4 border border-white/10 rounded-lg bg-black/40">
      <h2 className="text-xl font-semibold mb-4">Update Timestamp</h2>
      
      <Alert className="bg-black/30 border-neon-cyan/20 mb-4">
        <AlertDescription>
          This will update the "Last Updated" timestamp shown to all users on the map.
        </AlertDescription>
      </Alert>
      
      {lastUpdate && (
        <div className="mb-4 text-sm">
          <p className="text-gray-400">Current timestamp:</p>
          <p className="text-neon-cyan font-medium">
            {format(lastUpdate, "MMMM d, yyyy 'at' h:mm:ss a")}
          </p>
        </div>
      )}
      
      <Button 
        onClick={updateTimestamp}
        disabled={isUpdating}
        className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
      >
        {isUpdating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </>
        ) : (
          <>
            <CalendarClock className="mr-2 h-4 w-4" />
            Set Current Time as Update
          </>
        )}
      </Button>
    </div>
  );
}
