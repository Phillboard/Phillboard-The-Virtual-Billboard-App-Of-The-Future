
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface City extends Coordinates {
  name: string;
}

export interface Phillboard {
  title: string;
  username: string;
  lat: number;
  lng: number;
  image_type: string;
  user_id: string;
  content: string | null;
}
