
import { MapPin } from "@/components/map/types";

/**
 * Map selected image to placement type
 */
export const getPlacementType = (imageSelection: string) => {
  switch (imageSelection) {
    case "1": return "human";
    case "2": return "building";
    case "3": return "billboard";
    default: return "human";
  }
};
