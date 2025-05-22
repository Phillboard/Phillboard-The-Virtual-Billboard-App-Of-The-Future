
import { supabase } from "@/integrations/supabase/client";
import { UserLocation, MapPin } from "@/components/map/types";

// Calculate distance between two coordinates in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Format distance for display
function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} ft`;
  } else {
    const miles = distanceInMeters / 1609.34; // Convert meters to miles
    return `${miles.toFixed(1)} mi`;
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
          user_id: session.user.id // Always use the authenticated user's ID
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

// Get user phillboard count
export async function getUserPhillboardCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('phillboards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching phillboard count:", error);
      throw error;
    }
    
    return count || 0;
  } catch (err) {
    console.error("Failed to fetch phillboard count:", err);
    return 0;
  }
}

// Calculate phillboard percentile for a user
export async function getPhillboardPercentile(userId: string): Promise<number> {
  try {
    // First, get the user's count
    const userCount = await getUserPhillboardCount(userId);
    
    if (userCount === 0) return 0;
    
    // Then, get counts of all users
    const { data, error } = await supabase
      .from('phillboards')
      .select('user_id')
      .not('user_id', 'is', null);
      
    if (error) {
      console.error("Error fetching phillboard user data:", error);
      throw error;
    }
    
    // Group by user_id and count
    const userCounts = data.reduce((acc, item) => {
      const uid = item.user_id as string;
      acc[uid] = (acc[uid] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array of counts
    const counts = Object.values(userCounts);
    
    // Calculate percentile
    const lowerCounts = counts.filter(count => count < userCount);
    const percentile = (lowerCounts.length / counts.length) * 100;
    
    return percentile;
  } catch (err) {
    console.error("Failed to calculate phillboard percentile:", err);
    return 0;
  }
}
