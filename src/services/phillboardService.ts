
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
    return `${(distanceInMeters / 1000).toFixed(1)} mi`;
  }
}

// Fetch phillboards near a location
export async function fetchNearbyPhillboards(userLocation: UserLocation): Promise<MapPin[]> {
  try {
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
        image_type: pin.image_type,
        content: pin.content
      };
    });
    
    // Sort by distance
    return pinsWithDistance.sort((a, b) => {
      const distA = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
      const distB = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
      return distA - distB;
    });
    
  } catch (err) {
    console.error("Failed to fetch nearby phillboards:", err);
    return [];
  }
}

// Create a new phillboard
export async function createPhillboard(phillboard: Omit<MapPin, 'id' | 'distance'>) {
  try {
    const { data, error } = await supabase
      .from('phillboards')
      .insert([
        {
          title: phillboard.title,
          username: phillboard.username,
          lat: phillboard.lat,
          lng: phillboard.lng,
          image_type: phillboard.image_type || 'text',
          content: phillboard.content || null
        }
      ])
      .select();
      
    if (error) {
      console.error("Error creating phillboard:", error);
      throw error;
    }
    
    return data?.[0];
  } catch (err) {
    console.error("Failed to create phillboard:", err);
    throw err;
  }
}
