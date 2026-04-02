package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
