package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sefer hangi araca ait
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    // Sefer hangi hatta
    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    // Sefer başlangıç zamanı
    @Column(nullable = false)
    private LocalDateTime startTime;

    // Sefer bitiş zamanı
    private LocalDateTime endTime;

    // 🔥 KRİTİK ALAN (DB bunu istiyor)
    @Column(name = "current_stop_order", nullable = false)
    private Integer currentStopOrder;

    // Sefer aktif mi?
    @Column(nullable = false)
    private boolean active = true;

    // ===== GETTER / SETTER =====

    public Long getId() {
        return id;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getCurrentStopOrder() {
        return currentStopOrder;
    }

    public void setCurrentStopOrder(Integer currentStopOrder) {
        this.currentStopOrder = currentStopOrder;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}