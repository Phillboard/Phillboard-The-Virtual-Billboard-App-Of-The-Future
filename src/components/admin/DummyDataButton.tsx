
import { useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { DUMMY_SAYINGS } from "@/data/dummySayings";

export function DummyDataButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomUsername = () => {
    // Generate a random username
    const adjectives = ["happy", "cool", "neon", "digital", "cyber", "virtual", "augmented", "tech", "urban", "cosmic"];
    const nouns = ["user", "explorer", "creator", "dreamer", "artist", "builder", "viewer", "guru", "pioneer", "designer"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    
    return `${adjective}${noun}${number}`.toLowerCase();
  };

  const generateRandomCoordinates = () => {
    // Generate random coordinates around Charleston, WV
    // These are approximate coordinates for Charleston
    const baseLat = 38.3498;
    const baseLng = -81.6326;
    
    // Add some randomness to the coordinates (within roughly a 2-mile radius)
    const latVariance = (Math.random() - 0.5) * 0.05;
    const lngVariance = (Math.random() - 0.5) * 0.05;
    
    return {
      lat: baseLat + latVariance,
      lng: baseLng + lngVariance
    };
  };

  const generate = async () => {
    setIsGenerating(true);
    try {
      // 1. Create random user details
      const username = generateRandomUsername();
      const email = `${username}@phillboards.com`;
      const password = `Password123!${Math.floor(Math.random() * 999)}`;
      
      // 2. Register new user
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (signUpError) {
        console.error("Error creating user:", signUpError);
        toast.error(`Failed to create user: ${signUpError.message}`);
        return;
      }
      
      const userId = userData.user?.id;
      if (!userId) {
        toast.error("User creation failed - no user ID returned");
        return;
      }
      
      // 3. Generate random number of phillboards (5-25)
      const boardCount = 5 + Math.floor(Math.random() * 21); // 5 to 25
      
      // 4. Create phillboards for this user
      const phillboards = [];
      
      for (let i = 0; i < boardCount; i++) {
        const coords = generateRandomCoordinates();
        const saying = DUMMY_SAYINGS[Math.floor(Math.random() * DUMMY_SAYINGS.length)];
        
        phillboards.push({
          title: saying,
          username,
          user_id: userId,
          lat: coords.lat,
          lng: coords.lng,
          image_type: 'text',
          content: null
        });
      }
      
      // 5. Insert phillboards into database
      const { error: boardsError } = await supabase
        .from('phillboards')
        .insert(phillboards);
      
      if (boardsError) {
        console.error("Error creating phillboards:", boardsError);
        toast.error(`Failed to create phillboards: ${boardsError.message}`);
        return;
      }
      
      // 6. Success! Trigger confetti and toast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast.success(`Created user ${email} with ${boardCount} phillboards!`);
      
    } catch (err) {
      console.error("Error in generate function:", err);
      toast.error("An unexpected error occurred while generating data.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generate} 
      disabled={isGenerating}
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Data...
        </>
      ) : "Generate Dummy User & Phillboards"}
    </Button>
  );
}
