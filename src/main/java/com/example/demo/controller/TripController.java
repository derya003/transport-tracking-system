package com.example.demo.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Trip;
import com.example.demo.service.TripService;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // 🔥 SEFER BAŞLAT
    @PostMapping("/start")
    public Trip startTrip(
            @RequestParam Long vehicleId,
            @RequestParam Long routeId) {

        return tripService.startTrip(vehicleId, routeId);
    }
    // ✅ AKTİF SEFERLERİ GETİR (İŞTE ARADIĞIN)
    @GetMapping("/active")
    public List<Trip> getActiveTrips() {
        return tripService.getActiveTrips();
    }

    @PutMapping("/{tripId}/next-stop")
public Trip nextStop(@PathVariable Long tripId) {
    return tripService.moveToNextStop(tripId);
}
// ⏱️ ETA – dakika cinsinden
@GetMapping("/{tripId}/eta")
public long getEta(@PathVariable Long tripId) {
    return tripService.calculateEtaMinutes(tripId);
}

}