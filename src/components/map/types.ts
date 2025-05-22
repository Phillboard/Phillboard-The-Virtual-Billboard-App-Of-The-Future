
// Update the MapPin type to include created_at
export interface UserLocation {
  lat: number;
  lng: number;
}

export interface MapPin {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  username: string;
  distance: string;
  image_type?: string;
  content?: string;
  created_at?: string;
  placement_type?: string;
}
