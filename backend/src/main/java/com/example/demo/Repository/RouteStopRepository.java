package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RouteStop;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    // BELİRLİ BİR ROUTE İÇİN, STOP ORDER'A GÖRE SIRALI
    List<RouteStop> findByRouteIdOrderByStopOrderAsc(Long routeId);
}