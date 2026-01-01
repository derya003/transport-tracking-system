package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public TripService(TripRepository tripRepository,
                       VehicleRepository vehicleRepository,
                       RouteRepository routeRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
    }

    // 🚍 SEFER BAŞLAT
    @Transactional
    public Trip startTrip(Long vehicleId, Long routeId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        // Araç bu hatta mı?
        if (vehicle.getRoute() == null ||
            !vehicle.getRoute().getId().equals(routeId)) {
            throw new RuntimeException("Vehicle is not assigned to this route");
        }

        Trip trip = new Trip();
        trip.setVehicle(vehicle);
        trip.setRoute(route);
        trip.setStartTime(LocalDateTime.now());
        trip.setCurrentStopOrder(1); // 🔥 ZORUNLU
        trip.setActive(true);

        return tripRepository.save(trip);
    }

    // ➡️ BİR SONRAKİ DURAK
    @Transactional
    public Trip moveToNextStop(Long tripId) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.isActive()) {
            throw new RuntimeException("Trip already finished");
        }

        int current = trip.getCurrentStopOrder();
        int totalStops = trip.getRoute().getRouteStops().size();

        // Son durak mı?
        if (current >= totalStops) {
            trip.setActive(false);
            trip.setEndTime(LocalDateTime.now());
            return tripRepository.save(trip);
        }

        // Devam et
        trip.setCurrentStopOrder(current + 1);
        return tripRepository.save(trip);
    }

    // ✅ AKTİF SEFERLER
    public List<Trip> getActiveTrips() {
        return tripRepository.findByActiveTrue();
    }
}