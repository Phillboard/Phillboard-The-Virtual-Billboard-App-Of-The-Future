
import { supabase } from "@/integrations/supabase/client";
import { getRandomCoordinates } from "@/utils/coordinateUtils";
import { generateRandomUsername, generateRandomSaying, getRandomInt } from "@/utils/dummyDataUtils";
import { eastCoastCities } from "@/data/geoData";
import { Phillboard } from "@/types/geoTypes";

export async function generateDummyData(): Promise<{success: boolean, message: string}> {
  try {
    // Generate a random username
    const username = generateRandomUsername();
    const email = `${username}@phillboards.com`;
    
    // Create a random password
    const password = Math.random().toString(36).slice(-8);
    
    // Sign up a new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (authError) {
      console.error("Error creating dummy user:", authError);
      return { success: false, message: `Error creating dummy user: ${authError.message}` };
    }
    
    const userId = authData.user?.id;
    
    if (!userId) {
      return { success: false, message: "Failed to retrieve user ID after creation" };
    }
    
    // Generate random number of phillboards (5-25)
    const numPhillboards = getRandomInt(5, 25);
    console.log(`Generating ${numPhillboards} phillboards for user ${username} (${email})`);
    
    const phillboards: Omit<Phillboard, 'id'>[] = [];
    
    // Generate phillboards
    for (let i = 0; i < numPhillboards; i++) {
      // Pick a random east coast city
      const city = eastCoastCities[Math.floor(Math.random() * eastCoastCities.length)];
      
      // Generate coordinates within 10km of the city center
      const coords = getRandomCoordinates(city.lat, city.lng, 10);
      
      // Create phillboard
      phillboards.push({
        title: generateRandomSaying(),
        username: username,
        lat: coords.lat,
        lng: coords.lng,
        image_type: 'text', // Text-only phillboards
        user_id: userId,
        content: null
      });
    }
    
    // Insert phillboards in batches
    const batchSize = 5;
    for (let i = 0; i < phillboards.length; i += batchSize) {
      const batch = phillboards.slice(i, i + batchSize);
      const { error } = await supabase
        .from('phillboards')
        .insert(batch);
        
      if (error) {
        console.error(`Error creating phillboards batch ${Math.floor(i/batchSize) + 1}:`, error);
      }
    }
    
    return { 
      success: true, 
      message: `Successfully created dummy user ${username} (${email}) with password "${password}" and ${numPhillboards} phillboards`
    };
    
  } catch (error) {
    console.error("Error generating dummy data:", error);
    return { 
      success: false, 
      message: `Error generating dummy data: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}
