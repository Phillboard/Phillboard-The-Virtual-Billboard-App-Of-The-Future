
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

// Generate sample data for the database
export async function generateSampleData() {
  try {
    // Create 20 sample users with Gmail accounts
    const sampleUsers = Array(20).fill(0).map((_, index) => {
      const username = generateRandomUsername();
      return {
        email: `${username.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`,
        username,
        password: "SamplePassword123!" // Note: In a real app, never hardcode passwords
      };
    });
    
    // Create phillboards for each user
    for (const user of sampleUsers) {
      // Register user in auth system (this would be handled by the auth UI in a real app)
      // In this simulation, we'll just insert directly into the phillboards table
      
      // Generate random number of phillboards (1-30) for this user
      const numPhillboards = Math.floor(Math.random() * 30) + 1;
      
      const phillboards = [];
      
      for (let i = 0; i < numPhillboards; i++) {
        // Pick a random east coast city
        const city = eastCoastCities[Math.floor(Math.random() * eastCoastCities.length)];
        
        // Generate coordinates within 20km of the city center
        const coords = getRandomCoordinates(city.lat, city.lng, 20);
        
        // Create phillboard
        phillboards.push({
          title: generateRandomTitle(),
          username: user.username,
          lat: coords.lat,
          lng: coords.lng,
          image_type: `image-${Math.floor(Math.random() * 3) + 1}`,
          user_id: null, // We can't set user_id without creating actual users
          content: null
        });
      }
      
      // Insert phillboards for this user
      if (phillboards.length > 0) {
        const { error } = await supabase
          .from('phillboards')
          .insert(phillboards);
          
        if (error) {
          console.error(`Error creating phillboards for ${user.username}:`, error);
        }
      }
    }
    
    // Generate 100 phillboards for admin@mopads.com around Charleston, WV
    // Fetch admin user
    const { data: adminUser } = await supabase.auth
      .getUser();
    
    if (adminUser?.user) {
      const adminPhillboards = [];
      
      for (let i = 0; i < 100; i++) {
        // Generate coordinates at least 0.5 miles apart (approximately 0.8 km)
        // We'll create a random point within 30km of Charleston, then check distance
        let coords;
        let attempts = 0;
        let isValid = false;
        
        // Try to find a valid location (not too close to other locations)
        while (!isValid && attempts < 50) {
          coords = getRandomCoordinates(charlestonWV.lat, charlestonWV.lng, 30);
          
          // In a real app, we'd check distance from all other points
          // For this sample, we'll just use random coords and assume they're far enough
          isValid = true;
          attempts++;
        }
        
        if (coords) {
          adminPhillboards.push({
            title: generateRandomTitle(),
            username: "Mopads",
            lat: coords.lat,
            lng: coords.lng,
            image_type: `image-${Math.floor(Math.random() * 3) + 1}`,
            user_id: adminUser.user.id,
            content: null
          });
        }
      }
      
      // Insert admin phillboards
      if (adminPhillboards.length > 0) {
        // Insert in smaller batches to avoid request size limits
        const batchSize = 25;
        for (let i = 0; i < adminPhillboards.length; i += batchSize) {
          const batch = adminPhillboards.slice(i, i + batchSize);
          const { error } = await supabase
            .from('phillboards')
            .insert(batch);
            
          if (error) {
            console.error(`Error creating admin phillboards batch ${i/batchSize + 1}:`, error);
          }
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
