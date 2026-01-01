package com.example.demo.controller;

public class RouteStatsResponse {

    public long tripCount;
    public long ticketCount;
    public double totalRevenue;

    public RouteStatsResponse(long tripCount, long ticketCount, double totalRevenue) {
        this.tripCount = tripCount;
        this.ticketCount = ticketCount;
        this.totalRevenue = totalRevenue;
    }
}