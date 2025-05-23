
import { formatDistanceToNow } from "date-fns";
import { Phillboard } from "./types";

// Format the created_at date to a relative time (e.g., "5 minutes ago")
export const formatTime = (timestamp: string) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    return "recently";
  }
};

// Get approximate location description based on coordinates
export const getLocationDescription = (lat: number, lng: number) => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

// Get friendly placement type label
export const getPlacementTypeLabel = (type?: string) => {
  switch (type) {
    case "human": return "Above human/object";
    case "building": return "Above building";
    case "billboard": return "Billboard size";
    default: return "Standard placement";
  }
};
