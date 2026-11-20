import type { TractData } from '../types';

// Distribution Depots across Central Florida
export interface Depot {
  id: string;
  name: string;
  address: string;
  county: string;
  latitude: number;
  longitude: number;
}

// Non-empty tuple so `DEPOTS[0]` is always defined.
export const DEPOTS: [Depot, ...Depot[]] = [
  {
    id: 'second_harvest',
    name: 'Second Harvest Food Bank of Central Florida',
    address: '411 Mercy Dr, Orlando, FL 32805',
    county: 'Orange',
    latitude: 28.5583,
    longitude: -81.4282,
  },
  {
    id: 'osceola_hub',
    name: 'Osceola Community Food Distribution Center',
    address: '1500 US-192, Kissimmee, FL 34744',
    county: 'Osceola',
    latitude: 28.2919,
    longitude: -81.3912,
  },
  {
    id: 'lake_hub',
    name: 'Lake County Mobile Pantry Center',
    address: '315 W Main St, Tavares, FL 32778',
    county: 'Lake',
    latitude: 28.8039,
    longitude: -81.7298,
  },
  {
    id: 'seminole_hub',
    name: 'Seminole Food Outreach Depot',
    address: '515 S Park Ave, Sanford, FL 32771',
    county: 'Seminole',
    latitude: 28.8089,
    longitude: -81.2676,
  },
];

// Helper: Haversine distance in miles
export function getHaversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Find surrounding tract for lat/lng to get poverty & gap type
export function findSurroundingTract(lat: number, lng: number, tracts: TractData[]): TractData | null {
  let nearest: TractData | null = null;
  let minDist = Infinity;
  for (const t of tracts) {
    if (typeof t.latitude !== 'number' || typeof t.longitude !== 'number') continue;
    const dist = getHaversineMiles(lat, lng, t.latitude, t.longitude);
    if (dist < minDist) {
      minDist = dist;
      nearest = t;
    }
  }
  return nearest;
}

// Helper to format 24h time to 12h string
export function formatTimeStr(minutesFromMidnight: number): string {
  const hrs = Math.floor(minutesFromMidnight / 60) % 24;
  const mins = Math.floor(minutesFromMidnight % 60);
  const period = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  const displayMins = mins < 10 ? `0${mins}` : `${mins}`;
  return `${displayHrs}:${displayMins} ${period}`;
}
