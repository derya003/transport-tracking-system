package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Ticket;
import com.example.demo.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // 🎟️ Bilet satın al
    @PostMapping("/buy")
    public Ticket buyTicket(
            @RequestParam Long tripId,
            @RequestParam String type) {

        return ticketService.buyTicket(tripId, type);
    }

    // 🎟️ Seferin biletleri
    @GetMapping
    public List<Ticket> getTicketsByTrip(@RequestParam Long tripId) {
        return ticketService.getTicketsByTrip(tripId);
    }
    
}