package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Repository.RouteRepository;
import com.example.demo.Repository.VehicleRepository;
import com.example.demo.entity.Route;
import com.example.demo.entity.Vehicle;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;

    // Constructor injection
    public VehicleService(VehicleRepository vehicleRepository,
                          RouteRepository routeRepository) {
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
    }

    // ✅ Normal araç ekleme (route yok)
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    // ✅ Tüm araçlar
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // 🔥 VAR OLAN ARACI VAR OLAN ROUTE'A BAĞLA
    public Vehicle assignRoute(Long vehicleId, Long routeId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        vehicle.setRoute(route);
        return vehicleRepository.save(vehicle);
    }
}