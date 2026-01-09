package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Route;
import com.example.demo.entity.RouteStop;
import com.example.demo.service.RouteService;
import com.example.demo.service.RouteStopService;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;
    private final RouteStopService routeStopService;

    public RouteController(RouteService routeService,
                           RouteStopService routeStopService) {
        this.routeService = routeService;
        this.routeStopService = routeStopService;
    }

    // Hat ekle
    @PostMapping
    public Route createRoute(@RequestBody Route route) {
        return routeService.createRoute(route);
    }

    // Tüm hatları getir
    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    // ID ile hat getir
    @GetMapping("/{id}")
    public Route getRouteById(@PathVariable Long id) {
        return routeService.getRouteById(id);
    }

    // Hat sil
    @DeleteMapping("/{id}")
    public void deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
    }

    // Route → Stop ekle
    @PostMapping("/{routeId}/stops")
    public RouteStop addStopToRoute(
            @PathVariable Long routeId,
            @RequestParam Long stopId,
            @RequestParam Integer order,
            @RequestParam(required = false) Double distanceKm) {

        return routeStopService.addStopToRoute(routeId, stopId, order, distanceKm);
    }

    // Route'un duraklarını sırayla getir
    @GetMapping("/{routeId}/stops")
    public List<RouteStop> getRouteStopsOrdered(@PathVariable Long routeId) {
        return routeService.getRouteStopsOrdered(routeId);
    }

    // 🔥 ROUTE'TAN TEK DURAK SİLME (ASIL OLAY)
    @DeleteMapping("/{routeId}/stops/{routeStopId}")
    public void removeStopFromRoute(
            @PathVariable Long routeId,
            @PathVariable Long routeStopId) {

        routeStopService.removeStopFromRoute(routeId, routeStopId);
    }
}