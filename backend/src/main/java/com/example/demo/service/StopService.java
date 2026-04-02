package com.example.demo.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.Repository.StopRepository;
import com.example.demo.entity.Stop;

@Service
public class StopService {

    private final StopRepository stopRepository;

    public StopService(StopRepository stopRepository) {
        this.stopRepository = stopRepository;
    }

    public Stop createStop(Stop stop) {
        if (stop == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stop cannot be null");
        }
        return stopRepository.save(stop);
    }

    public List<Stop> getAllStops() {
        return stopRepository.findAll();
    }

    public Stop getStopById(Long id) {
        if (id == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stop ID is required");
        }
        return stopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Stop not found"));
    }

    public void deleteStop(Long id) {
        if (id == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stop ID is required");
        }
        stopRepository.deleteById(id);
    }
}