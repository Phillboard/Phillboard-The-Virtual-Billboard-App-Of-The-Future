
import { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthCard } from "@/components/AuthForms";
import { PermissionsPrompt } from "@/components/PermissionsPrompt";
import { Navigation } from "@/components/Navigation";
import { MapScreen } from "@/components/MapScreen";
import { ARScreen } from "@/components/ARScreen";
import { StatsScreen } from "@/components/StatsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";

const Index = () => {
  const [appState, setAppState] = useState<"splash" | "auth" | "permissions" | "main">("splash");
  const [activeTab, setActiveTab] = useState<string>("map");
  
  const handleSplashComplete = () => {
    setAppState("auth");
  };
  
  const handleAuthComplete = () => {
    setAppState("permissions");
  };
  
  const handlePermissionsComplete = () => {
    setAppState("main");
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {appState === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      
      {appState === "auth" && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
          <AuthCard onAuth={handleAuthComplete} />
        </div>
      )}
      
      {appState === "permissions" && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
          <PermissionsPrompt onComplete={handlePermissionsComplete} />
        </div>
      )}
      
      {appState === "main" && (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          {activeTab === "map" && <MapScreen />}
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
