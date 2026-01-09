package com.example.demo.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.Repository.RouteRepository;
import com.example.demo.Repository.RouteStopRepository;
import com.example.demo.entity.Route;
import com.example.demo.entity.RouteStop;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;

    // CONSTRUCTOR – İKİ REPOSITORY DE BURADA
    public RouteService(RouteRepository routeRepository,
                        RouteStopRepository routeStopRepository) {
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
    }

    // Route oluştur
    public Route createRoute(Route route) {
        if (route == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route cannot be null");
        }
        return routeRepository.save(route);
    }

    // Tüm routelar
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    // ID ile route
    public Route getRouteById(Long id) {
        if (id == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route ID is required");
        }
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Route not found"));
    }

    // Route sil
    public void deleteRoute(Long id) {
        if (id == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route ID is required");
        }
        routeRepository.deleteById(id);
    }

    // 🔥 ROUTE'UN DURAKLARINI SIRALI GETİR
    public List<RouteStop> getRouteStopsOrdered(Long routeId) {
        if (routeId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Route ID is required");
        }
        return routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId);
    }
}