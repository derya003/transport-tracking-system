package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Repository.RouteRepository;
import com.example.demo.Repository.RouteStopRepository;
import com.example.demo.entity.Route;
import com.example.demo.entity.RouteStop;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;

    // 🔥 CONSTRUCTOR – İKİ REPOSITORY DE BURADA
    public RouteService(RouteRepository routeRepository,
                        RouteStopRepository routeStopRepository) {
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
    }

    // Route oluştur
    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    // Tüm routelar
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    // ID ile route
    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
    }

    // Route sil
    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }

    // 🔥 ROUTE'UN DURAKLARINI SIRALI GETİR
    public List<RouteStop> getRouteStopsOrdered(Long routeId) {
        return routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId);
    }
}