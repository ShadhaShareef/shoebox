import { cityCoords } from './retail';

type GeoPoint = { lat: number; lng: number };

const toRad = (value: number) => (value * Math.PI) / 180;

export const haversineKm = (a: GeoPoint, b: GeoPoint) => {
  const earthRadius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
};

export const estimateStoreDistance = (fromCity: string, storeCity: string) => {
  const from = cityCoords[fromCity];
  const to = cityCoords[storeCity];
  if (!from || !to) return 0;
  return haversineKm(from, to);
};

export const nearestStoreCity = (fromCity: string, storeCities: string[]) => {
  const distances = storeCities.map((city) => ({ city, distance: estimateStoreDistance(fromCity, city) }));
  return distances.sort((a, b) => a.distance - b.distance)[0];
};
