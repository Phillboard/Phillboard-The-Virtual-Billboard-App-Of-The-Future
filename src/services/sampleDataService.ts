
import { supabase } from "@/integrations/supabase/client";
import { getRandomCoordinates, arePointsFarEnough } from "@/utils/coordinateUtils";
import { generateRandomTitle, generateRandomUsername } from "@/utils/randomDataUtils";
import { eastCoastCities, charlestonWV } from "@/data/geoData";
import { Coordinates, Phillboard } from "@/types/geoTypes";

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
    
    await generateUsersPhillboards(sampleUsernames, adminId);
    await generateAdminPhillboards(adminId);
    
    return true;
  } catch (error) {
    console.error("Error generating sample data:", error);
    return false;
  }
}

// Generate phillboards for each username
async function generateUsersPhillboards(sampleUsernames: string[], adminId: string) {
  for (const username of sampleUsernames) {
    // Generate random number of phillboards (1-30) for this user
    const numPhillboards = Math.floor(Math.random() * 30) + 1;
    console.log(`Creating ${numPhillboards} phillboards for ${username}`);
    
    const phillboards: Phillboard[] = [];
    
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
      await insertPhillboardsInBatches(phillboards);
    }
  }
}

// Generate 100 phillboards for admin around Charleston, WV
async function generateAdminPhillboards(adminId: string) {
  console.log("Creating 100 phillboards around Charleston, WV");
    
  const adminPhillboards: Phillboard[] = [];
  const existingLocations: Coordinates[] = [];
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
    await insertPhillboardsInBatches(adminPhillboards);
  }
}

// Insert phillboards in batches
async function insertPhillboardsInBatches(phillboards: Phillboard[]) {
  const batchSize = 10;
  for (let i = 0; i < phillboards.length; i += batchSize) {
    const batch = phillboards.slice(i, i + batchSize);
    const { error } = await supabase
      .from('phillboards')
      .insert(batch);
      
    if (error) {
      console.error(`Error creating phillboards batch ${Math.floor(i/batchSize) + 1}:`, error);
    } else {
      console.log(`Successfully inserted batch ${Math.floor(i/batchSize) + 1}`);
    }
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
