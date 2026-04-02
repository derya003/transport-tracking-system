package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
}