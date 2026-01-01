package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Repository.StopRepository;
import com.example.demo.entity.Stop;

@Service
public class StopService {

    private final StopRepository stopRepository;

    public StopService(StopRepository stopRepository) {
        this.stopRepository = stopRepository;
    }

    public Stop createStop(Stop stop) {
        return stopRepository.save(stop);
    }

    public List<Stop> getAllStops() {
        return stopRepository.findAll();
    }

    public Stop getStopById(Long id) {
        return stopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stop not found"));
    }

    public void deleteStop(Long id) {
        stopRepository.deleteById(id);
    }
}