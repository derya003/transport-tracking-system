package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.Repository.TicketRepository;
import com.example.demo.Repository.TripRepository;
import com.example.demo.entity.Ticket;
import com.example.demo.entity.Trip;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;

    public TicketService(
            TicketRepository ticketRepository,
            TripRepository tripRepository) {
        this.ticketRepository = ticketRepository;
        this.tripRepository = tripRepository;
    }

    // 🎟️ BİLET SATIN AL (Geliştirilmiş validation ile)
    @Transactional
    public Ticket buyTicket(Long tripId, String type) {
        // Validation
        if (tripId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trip ID is required");
        }
        
        if (type == null || type.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ticket type is required (STUDENT or FULL)");
        }

        if (!type.equalsIgnoreCase("STUDENT") && !type.equalsIgnoreCase("FULL")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ticket type must be STUDENT or FULL");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Trip not found"));

        if (!trip.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot buy ticket for inactive trip");
        }

        Ticket ticket = new Ticket();
        ticket.setTrip(trip);
        ticket.setType(type.toUpperCase());
        ticket.setPurchaseTime(LocalDateTime.now());
        ticket.setCreatedAt(LocalDateTime.now());

        // 💰 Fiyatlandırma
        if (type.equalsIgnoreCase("STUDENT")) {
            ticket.setPrice(10.0);
        } else {
            ticket.setPrice(20.0);
        }

        return ticketRepository.save(ticket);
    }

    // 🎟️ SEFERİN BİLETLERİ
    public List<Ticket> getTicketsByTrip(Long tripId) {
        if (tripId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trip ID is required");
        }
        return ticketRepository.findByTripId(tripId);
    }
}