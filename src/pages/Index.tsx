
import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Navigation } from "@/components/Navigation";
import { MapScreen } from "@/components/MapScreen";
import { ARScreen } from "@/components/ARScreen";
import { StatsScreen } from "@/components/StatsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { FeedScreen } from "@/components/FeedScreen";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const [appState, setAppState] = useState<"splash" | "main">("splash");
  const [activeTab, setActiveTab] = useState<string>("map");
  const { user, loading } = useAuth();
  
  const handleSplashComplete = () => {
    setAppState("main");
  };
  
  // If still loading auth state, show splash screen
  if (loading) {
    return <SplashScreen onComplete={() => {}} />;
  }
  
  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {appState === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      
      {appState === "main" && (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          {activeTab === "map" && <MapScreen />}
          {activeTab === "feed" && <FeedScreen />}
          {activeTab === "ar" && <ARScreen />}
          {activeTab === "stats" && <StatsScreen />}
          {activeTab === "profile" && <ProfileScreen />}
          
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
    </div>
  );
};

export default Index;
