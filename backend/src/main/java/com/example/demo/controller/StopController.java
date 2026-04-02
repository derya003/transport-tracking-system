package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Stop;
import com.example.demo.service.StopService;

@RestController
@RequestMapping("/api/stops")
public class StopController {

    private final StopService stopService;

    public StopController(StopService stopService) {
        this.stopService = stopService;
    }

    @PostMapping
    public Stop createStop(@RequestBody Stop stop) {
        return stopService.createStop(stop);
    }

    @GetMapping
    public List<Stop> getAllStops() {
        return stopService.getAllStops();
    }

    @GetMapping("/{id}")
    public Stop getStopById(@PathVariable Long id) {
        return stopService.getStopById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteStop(@PathVariable Long id) {
        stopService.deleteStop(id);
    }
}