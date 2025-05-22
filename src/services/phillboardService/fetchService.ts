import { supabase } from "@/integrations/supabase/client";
import { UserLocation, MapPin } from "@/components/map/types";
import { calculateDistance, formatDistance } from "../utils/distanceUtils";

// Fetch all phillboards (limited to 1000 for performance)
export async function fetchAllPhillboards(userLocation: UserLocation): Promise<MapPin[]> {
  try {
    console.log("Fetching all phillboards from database (max 1000)...");
    
    // Fetch phillboards with limit
    const { data, error } = await supabase
      .from('phillboards')
      .select('*')
      .limit(1000);
    
    if (error) {
      console.error("Error fetching phillboards:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No phillboards found in database");
      return [];
    }
    
    console.log(`Found ${data.length} phillboards in database`);
    
    // Calculate distance for each phillboard
    const pinsWithDistance = data.map(pin => {
      const distanceInMeters = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        pin.lat, 
        pin.lng
      );
      
      return {
        id: pin.id,
        lat: pin.lat,
        lng: pin.lng,
        title: pin.title,
        username: pin.username,
        distance: formatDistance(distanceInMeters),
        distanceValue: distanceInMeters, // Store the raw value for filtering
        image_type: pin.image_type,
        content: pin.content
      };
    }).sort((a, b) => a.distanceValue - b.distanceValue); // Sort by distance
    
    // Remove the distanceValue property before returning
    return pinsWithDistance.map(({ distanceValue, ...pin }) => pin);
  } catch (err) {
    console.error("Failed to fetch all phillboards:", err);
    return [];
  }
}

// Fetch phillboards near a location within a specified radius
export async function fetchNearbyPhillboards(
  userLocation: UserLocation, 
  radiusMiles: number = 0.5
): Promise<MapPin[]> {
  try {
    console.log(`Fetching phillboards from database within ${radiusMiles} miles...`);
    
    // Convert radius from miles to meters
    const radiusMeters = radiusMiles * 1609.34;
    
    // Fetch all phillboards from the database
    // In a real-world app with many entries, we would add pagination and filtering
    const { data, error } = await supabase
      .from('phillboards')
      .select('*');
    
    if (error) {
      console.error("Error fetching phillboards:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No phillboards found in database");
      return [];
    }
    
    console.log(`Found ${data.length} phillboards in database`);
    
    // Calculate distance for each phillboard and filter by radius
    const pinsWithDistance = data
      .map(pin => {
        const distanceInMeters = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          pin.lat, 
          pin.lng
        );
        
        return {
          id: pin.id,
          lat: pin.lat,
          lng: pin.lng,
          title: pin.title,
          username: pin.username,
          distance: formatDistance(distanceInMeters),
          distanceValue: distanceInMeters, // Store the raw value for filtering
          image_type: pin.image_type,
          content: pin.content
        };
      })
      .filter(pin => pin.distanceValue <= radiusMeters) // Only keep pins within radius
      .sort((a, b) => a.distanceValue - b.distanceValue); // Sort by distance
    
    // Remove the distanceValue property before returning
    return pinsWithDistance.map(({ distanceValue, ...pin }) => pin);
    
  } catch (err) {
    console.error("Failed to fetch nearby phillboards:", err);
    return [];
  }
}

// Fetch phillboards created by a specific user
export async function fetchUserPhillboards(userId: string): Promise<MapPin[]> {
  try {
    console.log(`Fetching phillboards for user ${userId}...`);
    
    // Fetch all phillboards from the database for this user
    const { data, error } = await supabase
      .from('phillboards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching user phillboards:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No phillboards found for this user");
      return [];
    }
    
    console.log(`Found ${data.length} phillboards for user`);
    
    // Map database results to MapPin objects
    const pins: MapPin[] = data.map(pin => ({
      id: pin.id,
      lat: pin.lat,
      lng: pin.lng,
      title: pin.title,
      username: pin.username,
      image_type: pin.image_type,
      content: pin.content,
      created_at: pin.created_at,
      distance: "N/A" // Distance not applicable in this context
    }));
    
    return pins;
    
  } catch (err) {
    console.error("Failed to fetch user phillboards:", err);
    return [];
  }
}
