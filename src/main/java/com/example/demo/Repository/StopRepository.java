package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Stop;

public interface StopRepository extends JpaRepository<Stop, Long> {
}