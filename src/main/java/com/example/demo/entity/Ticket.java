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
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    @JoinColumn(name="trip_id")
    private Trip trip;

    @Column(nullable=false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable=false)
    private Double price;

    public Long getId() { return id; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}