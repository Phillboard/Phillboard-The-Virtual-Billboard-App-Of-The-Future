
import { useState, useEffect } from "react";
import { checkARSupport } from "@/utils/arUtils";

export function useARSupport() {
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  
  useEffect(() => {
    checkARSupport().then(setARSupported);
  }, []);
  
  return arSupported;
}
