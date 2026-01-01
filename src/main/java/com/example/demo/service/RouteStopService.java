package com.example.demo.service;

import org.springframework.stereotype.Service;

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

    public RouteStop addStopToRoute(Long routeId, Long stopId, Integer order, Double distanceKm) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Stop stop = stopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Stop not found"));

        RouteStop routeStop = new RouteStop();
        routeStop.setRoute(route);
        routeStop.setStop(stop);
        routeStop.setStopOrder(order);
        routeStop.setDistanceToNextKm(distanceKm);

        return routeStopRepository.save(routeStop);
    }
}