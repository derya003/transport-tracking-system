package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // Aktif seferleri getir
    List<Trip> findByActiveTrue();
}