export interface Route {
  id: number;
  code: string;
  name: string;
  routeStops?: RouteStop[];
}

export interface Stop {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
}

export interface RouteStop {
  id: number;
  route: Route;
  stop: Stop;
  stopOrder: number;
  distanceKm?: number;
  distanceToNextKm?: number;
}

export interface Vehicle {
  id: number;
  busNumber: string; // Otobüs numarası (örn: "34A", "101", "K-42")
  type: string; // Otobüs, Minibüs, Tramvay, Metro
  route?: Route;
}

export interface Trip {
  id: number;
  vehicle: Vehicle;
  route: Route;
  startTime: string;
  endTime?: string;
  currentStopOrder: number;
  active: boolean;
}

export interface Ticket {
  id: number;
  trip: Trip;
  type: string; // STUDENT veya FULL
  price: number;
  purchaseTime: string;
  createdAt: string;
}

export interface TripStatsResponse {
  ticketCount: number;
  totalRevenue: number;
}

export interface RouteStatsResponse {
  tripCount: number;
  ticketCount: number;
  totalRevenue: number;
}
