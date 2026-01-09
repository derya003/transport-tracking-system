package com.example.demo.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        if (vehicle == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vehicle cannot be null");
        }
        return vehicleRepository.save(vehicle);
    }

    // ✅ Tüm araçlar
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // 🔥 VAR OLAN ARACI VAR OLAN ROUTE'A BAĞLA
    public Vehicle assignRoute(Long vehicleId, Long routeId) {
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
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Vehicle not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Route not found"));

        vehicle.setRoute(route);
        return vehicleRepository.save(vehicle);
    }
}