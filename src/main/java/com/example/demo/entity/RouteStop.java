package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "route_stops",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"route_id", "stop_order"}
    )
)
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "route_id")
    @JsonIgnore
    private Route route;

    @ManyToOne(optional = false)
    @JoinColumn(name = "stop_id")
    private Stop stop;

    @Column(name = "stop_order", nullable = false)
    private Integer stopOrder;

    private Double distanceToNextKm;

    public Long getId() { return id; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    public Stop getStop() { return stop; }
    public void setStop(Stop stop) { this.stop = stop; }

    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }

    public Double getDistanceToNextKm() { return distanceToNextKm; }
    public void setDistanceToNextKm(Double distanceToNextKm) {
        this.distanceToNextKm = distanceToNextKm;
    }
}