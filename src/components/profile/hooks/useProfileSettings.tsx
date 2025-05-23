
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileSettings() {
  const [personMode, setPersonMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { signOut } = useAuth();
  
  return {
    personMode,
    setPersonMode,
    notifications,
    setNotifications,
    signOut
  };
}
