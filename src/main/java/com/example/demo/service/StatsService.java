package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.Repository.TicketRepository;
import com.example.demo.Repository.TripRepository;

@Service
public class StatsService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;

    public StatsService(TicketRepository ticketRepository,
                        TripRepository tripRepository) {
        this.ticketRepository = ticketRepository;
        this.tripRepository = tripRepository;
    }

    // ===== TRIP =====
    public long getTicketCount(Long tripId) {
        return ticketRepository.countByTripId(tripId);
    }

    public double getTotalRevenue(Long tripId) {
        return ticketRepository.sumPriceByTripId(tripId);
    }

    // ===== ROUTE =====
    public long getTripCountByRoute(Long routeId) {
        return tripRepository.countByRouteId(routeId);
    }

    public long getTicketCountByRoute(Long routeId) {
        return ticketRepository.countByRouteId(routeId);
    }

    public double getRevenueByRoute(Long routeId) {
        return ticketRepository.sumPriceByRouteId(routeId);
    }
}