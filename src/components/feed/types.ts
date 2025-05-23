
import { MapPin } from "../map/types";

export interface Phillboard {
  id: string;
  title: string;
  username: string;
  created_at: string;
  image_type: string;
  content: string | null;
  lat: number;
  lng: number;
  placement_type?: string;
}

export const convertToMapPin = (phillboard: Phillboard): MapPin => ({
  id: phillboard.id,
  lat: phillboard.lat,
  lng: phillboard.lng,
  title: phillboard.title,
  username: phillboard.username,
  distance: "nearby", // Placeholder for distance
  image_type: phillboard.image_type as any,
  content: phillboard.content,
  placement_type: phillboard.placement_type
});
