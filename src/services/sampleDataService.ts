
import { supabase } from "@/integrations/supabase/client";

// Function to generate random coordinates within a radius around a center point
function getRandomCoordinates(centerLat: number, centerLng: number, radiusKm: number) {
  // Earth's radius in km
  const earthRadius = 6371;
  
  // Convert radius from km to radians
  const radiusInRadian = radiusKm / earthRadius;
  
  // Convert lat/lng to radians
  const centerLatRad = centerLat * Math.PI / 180;
  const centerLngRad = centerLng * Math.PI / 180;
  
  // Generate a random angle and distance
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radiusInRadian;
  
  // Calculate new position
  const newLatRad = Math.asin(
    Math.sin(centerLatRad) * Math.cos(randomDistance) +
    Math.cos(centerLatRad) * Math.sin(randomDistance) * Math.cos(randomAngle)
  );
  
  const newLngRad = centerLngRad + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(centerLatRad),
    Math.cos(randomDistance) - Math.sin(centerLatRad) * Math.sin(newLatRad)
  );
  
  // Convert back to degrees
  const newLat = newLatRad * 180 / Math.PI;
  const newLng = newLngRad * 180 / Math.PI;
  
  return { lat: newLat, lng: newLng };
}

// East Coast cities with their coordinates
const eastCoastCities = [
  { name: "Boston", lat: 42.3601, lng: -71.0589 },
  { name: "New York", lat: 40.7128, lng: -74.0060 },
  { name: "Philadelphia", lat: 39.9526, lng: -75.1652 },
  { name: "Washington DC", lat: 38.9072, lng: -77.0369 },
  { name: "Baltimore", lat: 39.2904, lng: -76.6122 },
  { name: "Richmond", lat: 37.5407, lng: -77.4360 },
  { name: "Charlotte", lat: 35.2271, lng: -80.8431 },
  { name: "Atlanta", lat: 33.7490, lng: -84.3880 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 }
];

// Charleston, WV coordinates
const charlestonWV = { lat: 38.3498, lng: -81.6326 };

// Generate random phillboard titles
const generateRandomTitle = () => {
  const adjectives = ["Digital", "Future", "Neon", "Cyber", "Tech", "Virtual", "Smart", "Epic", "Urban", "Modern"];
  const nouns = ["Hub", "Space", "Zone", "Nexus", "Portal", "Avenue", "City", "District", "Square", "Center"];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective} ${noun}`;
};

// Generate random usernames
const generateRandomUsername = () => {
  const prefixes = ["Cyber", "Digital", "Tech", "Neon", "Code", "Pixel", "Data", "Net", "Web", "Virtual"];
  const suffixes = ["Rider", "Nomad", "Master", "Guru", "Pro", "Ninja", "Wizard", "Explorer", "Pioneer", "Hacker"];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix}${suffix}`;
};

// Check if points are at least minDistanceKm apart
function arePointsFarEnough(point1: {lat: number, lng: number}, point2: {lat: number, lng: number}, minDistanceKm: number): boolean {
  // Earth's radius in km
  const R = 6371;
  
  // Convert lat/lng from degrees to radians
  const lat1 = point1.lat * Math.PI / 180;
  const lng1 = point1.lng * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const lng2 = point2.lng * Math.PI / 180;
  
  // Haversine formula to calculate distance between two points on Earth
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance >= minDistanceKm;
}

// Generate sample data for the database
export async function generateSampleData() {
  try {
    console.log("Starting sample data generation");
    
    // First, check if we have admin credentials
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.error("No active session found - user must be logged in as admin");
      return false;
    }
    
    const userEmail = sessionData.session.user.email;
    if (!userEmail || (!userEmail.endsWith('@mopads.com') && !userEmail.endsWith('@lovable.ai'))) {
      console.error("User is not an admin - only users with @mopads.com or @lovable.ai emails can generate sample data");
      return false;
    }
    
    const adminId = sessionData.session.user.id;
    console.log(`Admin user ID: ${adminId}, Email: ${userEmail}`);
    
    // Create 20 sample "users" (we're not actually creating auth users, just phillboards with usernames)
    const sampleUsernames = Array(20).fill(0).map(() => generateRandomUsername());
    console.log(`Generated ${sampleUsernames.length} sample usernames`);
    
    // Create phillboards for each username
    for (const username of sampleUsernames) {
      // Generate random number of phillboards (1-30) for this user
      const numPhillboards = Math.floor(Math.random() * 30) + 1;
      console.log(`Creating ${numPhillboards} phillboards for ${username}`);
      
      const phillboards = [];
      
      for (let i = 0; i < numPhillboards; i++) {
        // Pick a random east coast city
        const city = eastCoastCities[Math.floor(Math.random() * eastCoastCities.length)];
        
        // Generate coordinates within 20km of the city center
        const coords = getRandomCoordinates(city.lat, city.lng, 20);
        
        // Create phillboard
        phillboards.push({
          title: generateRandomTitle(),
          username: username,
          lat: coords.lat,
          lng: coords.lng,
          image_type: `image-${Math.floor(Math.random() * 3) + 1}`,
          user_id: adminId, // Important: Set the currently logged-in admin as the creator
          content: null
        });
      }
      
      // Insert phillboards for this user
      if (phillboards.length > 0) {
        // Insert in smaller batches to avoid request size limits
        const batchSize = 10;
        for (let i = 0; i < phillboards.length; i += batchSize) {
          const batch = phillboards.slice(i, i + batchSize);
          const { error } = await supabase
            .from('phillboards')
            .insert(batch);
            
          if (error) {
            console.error(`Error creating phillboards for ${username}:`, error);
          } else {
            console.log(`Successfully inserted batch ${Math.floor(i/batchSize) + 1} for ${username}`);
          }
        }
      }
    }
    
    // Generate 100 phillboards for admin@mopads.com around Charleston, WV
    console.log("Creating 100 phillboards around Charleston, WV");
    
    const adminPhillboards = [];
    const existingLocations: {lat: number, lng: number}[] = [];
    const minDistanceKm = 0.8; // About 0.5 miles
    
    let successfulPoints = 0;
    let attempts = 0;
    const maxAttempts = 1000; // To prevent infinite loops
    
    while (successfulPoints < 100 && attempts < maxAttempts) {
      // Generate coordinates within 30km of Charleston
      const coords = getRandomCoordinates(charlestonWV.lat, charlestonWV.lng, 30);
      attempts++;
      
      // Check if this point is far enough from all existing points
      let isFarEnough = true;
      for (const existingLocation of existingLocations) {
        if (!arePointsFarEnough(coords, existingLocation, minDistanceKm)) {
          isFarEnough = false;
          break;
        }
      }
      
      if (isFarEnough) {
        existingLocations.push(coords);
        adminPhillboards.push({
          title: generateRandomTitle(),
          username: "Mopads",
          lat: coords.lat,
          lng: coords.lng,
          image_type: `image-${Math.floor(Math.random() * 3) + 1}`,
          user_id: adminId,
          content: null
        });
        successfulPoints++;
        
        if (successfulPoints % 10 === 0) {
          console.log(`Generated ${successfulPoints} points around Charleston`);
        }
      }
    }
    
    console.log(`Generated ${adminPhillboards.length} admin phillboards after ${attempts} attempts`);
    
    // Insert admin phillboards
    if (adminPhillboards.length > 0) {
      // Insert in smaller batches to avoid request size limits
      const batchSize = 10;
      for (let i = 0; i < adminPhillboards.length; i += batchSize) {
        const batch = adminPhillboards.slice(i, i + batchSize);
        const { error } = await supabase
          .from('phillboards')
          .insert(batch);
          
        if (error) {
          console.error(`Error creating admin phillboards batch ${i/batchSize + 1}:`, error);
        } else {
          console.log(`Successfully inserted admin batch ${Math.floor(i/batchSize) + 1}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error generating sample data:", error);
    return false;
  }
}

// Function to check if sample data exists
export async function checkSampleDataExists() {
  const { count, error } = await supabase
    .from('phillboards')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error("Error checking sample data:", error);
    return false;
  }
  
  return count && count > 100;
}
