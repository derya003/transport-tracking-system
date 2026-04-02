import axios from 'axios';
import type {
  Route,
  Stop,
  RouteStop,
  Vehicle,
  Trip,
  Ticket,
  TripStatsResponse,
  RouteStatsResponse,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// ROUTES API
export const routesApi = {
  getAll: () =>
    api.get<Route[]>('/routes').then((res) => res.data),

  getById: (id: number) =>
    api.get<Route>(`/routes/${id}`).then((res) => res.data),

  create: (route: Omit<Route, 'id'>) =>
    api.post<Route>('/routes', route).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/routes/${id}`),

  // Route'a ait durakları getir
  getStops: (routeId: number) =>
    api
      .get<RouteStop[]>(`/routes/${routeId}/stops`)
      .then((res) => res.data),

  // Route'a durak ekle
  addStop: (
    routeId: number,
    stopId: number,
    order: number,
    distanceKm?: number
  ) =>
    api
      .post<RouteStop>(`/routes/${routeId}/stops`, null, {
        params: { stopId, order, distanceKm },
      })
      .then((res) => res.data),

  // ROUTE'TAN TEK DURAK SİLME (ASIL EKLENEN KISIM)
  removeStop: (routeId: number, routeStopId: number) =>
    api.delete(`/routes/${routeId}/stops/${routeStopId}`),
};


// STOPS API

export const stopsApi = {
  getAll: () =>
    api.get<Stop[]>('/stops').then((res) => res.data),

  getById: (id: number) =>
    api.get<Stop>(`/stops/${id}`).then((res) => res.data),

  create: (stop: Omit<Stop, 'id'>) =>
    api.post<Stop>('/stops', stop).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/stops/${id}`),
};


// VEHICLES API

export const vehiclesApi = {
  getAll: () =>
    api.get<Vehicle[]>('/vehicles').then((res) => res.data),

  create: (vehicle: Omit<Vehicle, 'id'>) =>
    api.post<Vehicle>('/vehicles', vehicle).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/vehicles/${id}`),

  assignRoute: (vehicleId: number, routeId: number) =>
    api
      .put<Vehicle>(`/vehicles/${vehicleId}/route/${routeId}`)
      .then((res) => res.data),
};


// TRIPS API

export const tripsApi = {
  start: (vehicleId: number, routeId: number) =>
    api
      .post<Trip>('/trips/start', null, {
        params: { vehicleId, routeId },
      })
      .then((res) => res.data),

  getActive: () =>
    api.get<Trip[]>('/trips/active').then((res) => res.data),

  nextStop: (tripId: number) =>
    api.put<Trip>(`/trips/${tripId}/next-stop`).then((res) => res.data),

  getEta: (tripId: number) =>
    api.get<number>(`/trips/${tripId}/eta`).then((res) => res.data),
};


// STATS API

export const statsApi = {
  getTripStats: (tripId: number) =>
    api
      .get<TripStatsResponse>(`/stats/trip/${tripId}`)
      .then((res) => res.data),

  getRouteStats: (routeId: number) =>
    api
      .get<RouteStatsResponse>(`/stats/route/${routeId}`)
      .then((res) => res.data),
};


// TICKETS API

export const ticketsApi = {
  buy: (tripId: number, type: 'STUDENT' | 'FULL') =>
    api
      .post<Ticket>('/tickets/buy', null, {
        params: { tripId, type },
      })
      .then((res) => res.data),

  getByTrip: (tripId: number) =>
    api
      .get<Ticket[]>(`/tickets?tripId=${tripId}`)
      .then((res) => res.data),
};
