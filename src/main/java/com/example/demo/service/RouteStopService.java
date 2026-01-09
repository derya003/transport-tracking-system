package com.example.demo.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.Repository.RouteRepository;
import com.example.demo.Repository.RouteStopRepository;
import com.example.demo.Repository.StopRepository;
import com.example.demo.entity.Route;
import com.example.demo.entity.RouteStop;
import com.example.demo.entity.Stop;

@Service
public class RouteStopService {

    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RouteStopRepository routeStopRepository;

    public RouteStopService(RouteRepository routeRepository,
                            StopRepository stopRepository,
                            RouteStopRepository routeStopRepository) {
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.routeStopRepository = routeStopRepository;
    }

    @Transactional
    public RouteStop addStopToRoute(Long routeId, Long stopId, Integer order, Double distanceKm) {
        // Validation
        if (routeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route ID is required");
        }
        
        if (stopId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stop ID is required");
        }
        
        if (order == null || order < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stop order must be greater than 0");
        }

        if (distanceKm != null && distanceKm < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Distance cannot be negative");
        }

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Route not found"));

        Stop stop = stopRepository.findById(stopId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Stop not found"));

        // Aynı sırada başka durak var mı kontrol et
        boolean orderExists = route.getRouteStops().stream()
                .anyMatch(rs -> rs.getStopOrder().equals(order));
        
        if (orderExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A stop already exists at order " + order);
        }

        RouteStop routeStop = new RouteStop();
        routeStop.setRoute(route);
        routeStop.setStop(stop);
        routeStop.setStopOrder(order);
        routeStop.setDistanceToNextKm(distanceKm);

        return routeStopRepository.save(routeStop);
    }
}