package com.example.demo.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber; // Otobüs numarası (örn: "34A", "101", "K-42")

    @Column(nullable = false)
    private String type; // Otobüs, Minibüs, Tramvay, Metro

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    public Long getId() { return id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
}