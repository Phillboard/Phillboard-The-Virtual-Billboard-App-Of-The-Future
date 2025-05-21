export interface UserLocation {
  lat: number;
  lng: number;
}

export interface MapPin {
  id: number | string;
  lat: number;
  lng: number;
  title: string;
  username: string;
  distance: string;
  image_type?: string;
  content?: string | null;
}

// We'll keep the fake data as fallback
export const defaultMapPins = [
  { id: 1, lat: 47.5, lng: 52.2, title: "Downtown Digital", username: "CyberAlex", distance: "120 ft" },
  { id: 2, lat: 47.7, lng: 51.9, title: "Tech Hub", username: "NeonRider", distance: "250 ft" },
  { id: 3, lat: 47.2, lng: 52.4, title: "Future Now", username: "DigitalNomad", distance: "85 ft" },
];
