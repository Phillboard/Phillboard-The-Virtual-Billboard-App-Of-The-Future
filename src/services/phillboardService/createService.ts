
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "@/components/map/types";

// Create a new phillboard
export async function createPhillboard(phillboard: Omit<MapPin, 'id' | 'distance'> & { user_id?: string }) {
  try {
    console.log("Creating new phillboard:", phillboard);
    
    // Check if we have user authentication
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.user;
    
    // If user is not authenticated, we'll return a locally created phillboard
    if (!isAuthenticated) {
      console.log("User not authenticated, returning local phillboard");
      return {
        id: Date.now().toString(),
        lat: phillboard.lat,
        lng: phillboard.lng,
        title: phillboard.title,
        username: phillboard.username,
        image_type: phillboard.image_type || 'text',
        content: phillboard.content || null,
        created_at: new Date().toISOString(),
        placement_type: phillboard.placement_type || 'human'
      };
    }
    
    const { data, error } = await supabase
      .from('phillboards')
      .insert([
        {
          title: phillboard.title,
          username: phillboard.username,
          lat: phillboard.lat,
          lng: phillboard.lng,
          image_type: phillboard.image_type || 'text',
          content: phillboard.content || null,
          user_id: session.user.id, // Always use the authenticated user's ID
          placement_type: phillboard.placement_type || 'human'
        }
      ])
      .select();
      
    if (error) {
      console.error("Error creating phillboard:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("No data returned from phillboard creation");
      throw new Error("Failed to create phillboard");
    }
    
    console.log("Created phillboard successfully:", data[0]);
    return data[0];
  } catch (err) {
    console.error("Failed to create phillboard:", err);
    throw err;
  }
}
