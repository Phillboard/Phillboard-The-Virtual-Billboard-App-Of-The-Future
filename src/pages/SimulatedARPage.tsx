import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SimulatedARView } from "@/components/ar/SimulatedARView";
import { ARViewMode } from "@/utils/arUtils";
import { MapPin } from "@/components/map/types";

export function SimulatedARPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState<MapPin | null>(null);
  const [viewMode, setViewMode] = useState<ARViewMode>(ARViewMode.HUMAN);

  useEffect(() => {
    const pinData = location.state?.pin;
    if (pinData) {
      setPin(pinData);
    } else {
      // If no pin data, create a demo pin
      setPin({
        id: "demo",
        title: "Demo Phillboard",
        content: "Welcome to AR simulation!",
        username: "demo_user",
        lat: 0,
        lng: 0,
        distance: "0m",
        created_at: new Date().toISOString(),
        placement_type: "human"
      });
    }
  }, [location.state]);

  const handleViewModeChange = (mode: ARViewMode) => {
    setViewMode(mode);
  };

  return (
    <SimulatedARView
      pin={pin}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    />
  );
}

export default SimulatedARPage;