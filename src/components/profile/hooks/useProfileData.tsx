
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserPhillboards } from "@/services/phillboardService";
import { Phillboard } from "../types";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileData() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phillboards, setPhillboards] = useState<Phillboard[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch user's phillboards
  useEffect(() => {
    const loadPhillboards = async () => {
      if (!user) return;
      
      try {
        const pins = await fetchUserPhillboards(user.id);
        
        // Convert pins to Phillboard format
        const formattedPhillboards: Phillboard[] = pins.map(pin => ({
          ...pin,
          date: new Date(pin.created_at || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));
        
        setPhillboards(formattedPhillboards);
      } catch (error) {
        console.error("Error loading phillboards:", error);
      }
    };
    
    loadPhillboards();
  }, [user]);
  
  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setUsername(data.username || user.user_metadata?.username || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    
    loadProfile();
  }, [user]);
  
  return {
    username,
    setUsername,
    avatarUrl, 
    setAvatarUrl,
    phillboards,
    isEditDialogOpen,
    setIsEditDialogOpen
  };
}
