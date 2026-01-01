package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.StatsService;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // 📊 Sefer istatistikleri
    @GetMapping("/trip/{tripId}")
    public TripStatsResponse getTripStats(@PathVariable Long tripId) {

        long ticketCount = statsService.getTicketCount(tripId);
        double revenue = statsService.getTotalRevenue(tripId);

        return new TripStatsResponse(ticketCount, revenue);
    }
    @GetMapping("/route/{routeId}")
    public RouteStatsResponse getRouteStats(@PathVariable Long routeId) {

      long tripCount = statsService.getTripCountByRoute(routeId);
      long ticketCount = statsService.getTicketCountByRoute(routeId);
      double revenue = statsService.getRevenueByRoute(routeId);

    return new RouteStatsResponse(tripCount, ticketCount, revenue);
}


    // 🔹 Mini DTO (iç class – sade çözüm)
    static class TripStatsResponse {
        public long ticketCount;
        public double totalRevenue;

        public TripStatsResponse(long ticketCount, double totalRevenue) {
            this.ticketCount = ticketCount;
            this.totalRevenue = totalRevenue;
        }
    }
}