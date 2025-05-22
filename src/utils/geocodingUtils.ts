
import { UserLocation } from "@/components/map/types";

// Reverse geocode coordinates to get location information
export async function reverseGeocode(location: UserLocation): Promise<{
  city: string;
  state: string;
} | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&result_type=locality|administrative_area_level_1&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      console.log("Geocoding API error or no results:", data.status);
      return null;
    }
    
    let city = "";
    let state = "";
    
    // Parse address components to find city and state
    for (const result of data.results) {
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name; // Use short_name for state code (e.g., WV)
        }
      }
    }
    
    if (city && state) {
      return { city, state };
    }
    
    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}

// Fallback method using our predefined locations
export function getFallbackLocation(lat: number, lng: number): {
  city: string;
  state: string;
} {
  // Default to Charleston, WV since that's our main area
  return {
    city: "Charleston",
    state: "WV"
  };
}
