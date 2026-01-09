package com.example.demo.controller;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    // 📊 Hat istatistikleri
    @GetMapping("/route/{routeId}")
    public RouteStatsResponse getRouteStats(@PathVariable Long routeId) {

      long tripCount = statsService.getTripCountByRoute(routeId);
      long ticketCount = statsService.getTicketCountByRoute(routeId);
      double revenue = statsService.getRevenueByRoute(routeId);

    return new RouteStatsResponse(tripCount, ticketCount, revenue);
}

    // 📊 Günlük istatistikler
    @GetMapping("/daily")
    public DailyStatsResponse getDailyStats(@RequestParam(required = false) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }

        long tripCount = statsService.getTripCountByDate(date);
        long ticketCount = statsService.getTicketCountByDate(date);
        double revenue = statsService.getRevenueByDate(date);

        return new DailyStatsResponse(date, tripCount, ticketCount, revenue);
    }

    // 📊 Haftalık istatistikler
    @GetMapping("/weekly")
    public WeeklyStatsResponse getWeeklyStats(@RequestParam(required = false) LocalDate startDate) {
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(7);
        }

        LocalDate endDate = startDate.plusDays(7);
        long tripCount = statsService.getTripCountByDateRange(startDate, endDate);
        long ticketCount = statsService.getTicketCountByDateRange(startDate, endDate);
        double revenue = statsService.getRevenueByDateRange(startDate, endDate);

        return new WeeklyStatsResponse(startDate, endDate, tripCount, ticketCount, revenue);
    }

    // 📊 Aylık istatistikler
    @GetMapping("/monthly")
    public MonthlyStatsResponse getMonthlyStats(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        
        if (year == null) {
            year = LocalDate.now().getYear();
        }
        if (month == null) {
            month = LocalDate.now().getMonthValue();
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1);

        long tripCount = statsService.getTripCountByDateRange(startDate, endDate);
        long ticketCount = statsService.getTicketCountByDateRange(startDate, endDate);
        double revenue = statsService.getRevenueByDateRange(startDate, endDate);

        return new MonthlyStatsResponse(year, month, tripCount, ticketCount, revenue);
    }

    // 🔹 DTO Classes
    static class TripStatsResponse {
        public long ticketCount;
        public double totalRevenue;

        public TripStatsResponse(long ticketCount, double totalRevenue) {
            this.ticketCount = ticketCount;
            this.totalRevenue = totalRevenue;
        }
    }

    static class RouteStatsResponse {
        public long tripCount;
        public long ticketCount;
        public double totalRevenue;

        public RouteStatsResponse(long tripCount, long ticketCount, double totalRevenue) {
            this.tripCount = tripCount;
            this.ticketCount = ticketCount;
            this.totalRevenue = totalRevenue;
        }
    }

    static class DailyStatsResponse {
        public LocalDate date;
        public long tripCount;
        public long ticketCount;
        public double revenue;

        public DailyStatsResponse(LocalDate date, long tripCount, long ticketCount, double revenue) {
            this.date = date;
            this.tripCount = tripCount;
            this.ticketCount = ticketCount;
            this.revenue = revenue;
        }
    }

    static class WeeklyStatsResponse {
        public LocalDate startDate;
        public LocalDate endDate;
        public long tripCount;
        public long ticketCount;
        public double revenue;

        public WeeklyStatsResponse(LocalDate startDate, LocalDate endDate, 
                                  long tripCount, long ticketCount, double revenue) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.tripCount = tripCount;
            this.ticketCount = ticketCount;
            this.revenue = revenue;
        }
    }

    static class MonthlyStatsResponse {
        public int year;
        public int month;
        public long tripCount;
        public long ticketCount;
        public double revenue;

        public MonthlyStatsResponse(int year, int month, 
                                   long tripCount, long ticketCount, double revenue) {
            this.year = year;
            this.month = month;
            this.tripCount = tripCount;
            this.ticketCount = ticketCount;
            this.revenue = revenue;
        }
    }
}
