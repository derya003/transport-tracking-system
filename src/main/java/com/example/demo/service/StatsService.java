package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    // ===== TARİH BAZLI İSTATİSTİKLER =====
    public long getTripCountByDate(LocalDate date) {
        // Bu sefer için tarih bazlı sorgu eklenebilir
        // Şimdilik tüm seferleri sayıyoruz
        return tripRepository.count();
    }

    public long getTicketCountByDate(LocalDate date) {
        return ticketRepository.countByDate(date);
    }

    public double getRevenueByDate(LocalDate date) {
        return ticketRepository.sumPriceByDate(date);
    }

    public long getTripCountByDateRange(LocalDate startDate, LocalDate endDate) {
        // Bu sefer için tarih bazlı sorgu eklenebilir
        return tripRepository.count();
    }

    public long getTicketCountByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        return ticketRepository.countByDateRange(startDateTime, endDateTime);
    }

    public double getRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        return ticketRepository.sumPriceByDateRange(startDateTime, endDateTime);
    }
}