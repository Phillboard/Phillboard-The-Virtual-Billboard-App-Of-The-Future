
import { Coordinates } from "@/types/geoTypes";

// Function to generate random coordinates within a radius around a center point
export function getRandomCoordinates(centerLat: number, centerLng: number, radiusKm: number): Coordinates {
  // Earth's radius in km
  const earthRadius = 6371;
  
  // Convert radius from km to radians
  const radiusInRadian = radiusKm / earthRadius;
  
  // Convert lat/lng to radians
  const centerLatRad = centerLat * Math.PI / 180;
  const centerLngRad = centerLng * Math.PI / 180;
  
  // Generate a random angle and distance
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radiusInRadian;
  
  // Calculate new position
  const newLatRad = Math.asin(
    Math.sin(centerLatRad) * Math.cos(randomDistance) +
    Math.cos(centerLatRad) * Math.sin(randomDistance) * Math.cos(randomAngle)
  );
  
  const newLngRad = centerLngRad + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(centerLatRad),
    Math.cos(randomDistance) - Math.sin(centerLatRad) * Math.sin(newLatRad)
  );
  
  // Convert back to degrees
  const newLat = newLatRad * 180 / Math.PI;
  const newLng = newLngRad * 180 / Math.PI;
  
  return { lat: newLat, lng: newLng };
}

// Check if points are at least minDistanceKm apart
export function arePointsFarEnough(
  point1: Coordinates, 
  point2: Coordinates, 
  minDistanceKm: number
): boolean {
  // Earth's radius in km
  const R = 6371;
  
  // Convert lat/lng from degrees to radians
  const lat1 = point1.lat * Math.PI / 180;
  const lng1 = point1.lng * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const lng2 = point2.lng * Math.PI / 180;
  
  // Haversine formula to calculate distance between two points on Earth
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance >= minDistanceKm;
}
