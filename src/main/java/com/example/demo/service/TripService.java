package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.Repository.RouteRepository;
import com.example.demo.Repository.TripRepository;
import com.example.demo.Repository.VehicleRepository;
import com.example.demo.entity.Route;
import com.example.demo.entity.Trip;
import com.example.demo.entity.Vehicle;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final PredictionEngine predictionEngine;

    public TripService(TripRepository tripRepository,
                       VehicleRepository vehicleRepository,
                       RouteRepository routeRepository,
                       PredictionEngine predictionEngine) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.predictionEngine = predictionEngine;
    }

    // 🚍 SEFER BAŞLAT
    @Transactional
    public Trip startTrip(Long vehicleId, Long routeId) {
        if (vehicleId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vehicle ID is required");
        }
        
        if (routeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route ID is required");
        }

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        // Araç bu hatta mı?
        if (vehicle.getRoute() == null ||
            !vehicle.getRoute().getId().equals(routeId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Vehicle is not assigned to this route"
            );
        }

        Trip trip = new Trip();
        trip.setVehicle(vehicle);
        trip.setRoute(route);
        trip.setStartTime(LocalDateTime.now());
        trip.setCurrentStopOrder(1); // 🔥 DB için zorunlu
        trip.setActive(true);

        return tripRepository.save(trip);
    }

    // ➡️ BİR SONRAKİ DURAK
    @Transactional
    public Trip moveToNextStop(Long tripId) {
        if (tripId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trip ID is required");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Trip already finished"
            );
        }

        int currentOrder = trip.getCurrentStopOrder();
        int totalStops = trip.getRoute().getRouteStops().size();

        // Son duraksa seferi bitir
        if (currentOrder >= totalStops) {
            trip.setActive(false);
            trip.setEndTime(LocalDateTime.now());
        } else {
            trip.setCurrentStopOrder(currentOrder + 1);
        }

        return tripRepository.save(trip);
    }

    // ⏱️ ETA – Varış süresi tahmini (dakika) - Gelişmiş tahmin motoru kullanıyor
    public long calculateEtaMinutes(Long tripId) {
        if (tripId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trip ID is required");
        }
        
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        return predictionEngine.calculateTripEta(trip);
    }

    // ⏱️ Belirli bir durağa ETA hesapla (dakika)
    public long calculateEtaToStop(Long tripId, Long stopId) {
        if (tripId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trip ID is required");
        }
        
        if (stopId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stop ID is required");
        }
        
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        return predictionEngine.calculateEtaToStop(trip, stopId);
    }

    // ✅ AKTİF SEFERLER
    public List<Trip> getActiveTrips() {
        return tripRepository.findByActiveTrue();
    }

    // 📜 GEÇMİŞ SEFERLER
    public List<Trip> getCompletedTrips() {
        return tripRepository.findByActiveFalseOrderByEndTimeDesc();
    }

    // 📜 HAT BAZLI GEÇMİŞ SEFERLER
    public List<Trip> getCompletedTripsByRoute(Long routeId) {
        if (routeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route ID is required");
        }
        return tripRepository.findByRouteIdAndActiveFalseOrderByEndTimeDesc(routeId);
    }
}