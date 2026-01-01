package com.example.demo.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Trip;

@Service
public class TripScheduler {

    private final TripService tripService;

    public TripScheduler(TripService tripService) {
        this.tripService = tripService;
    }

    // ⏱️ HER 30 SANİYEDE BİR ÇALIŞIR
    @Scheduled(fixedRate = 30000)
    public void simulateTrips() {

        List<Trip> activeTrips = tripService.getActiveTrips();

        for (Trip trip : activeTrips) {
            try {
                tripService.moveToNextStop(trip.getId());
            } catch (Exception e) {
                // Sefer bittiyse sessizce geç
            }
        }
    }
}