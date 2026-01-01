package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // 🎟️ BİLET SATIN AL
    @Transactional
    public Ticket buyTicket(Long tripId, String type) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.isActive()) {
            throw new RuntimeException("Trip is not active");
        }

        Ticket ticket = new Ticket();
        ticket.setTrip(trip);
        ticket.setType(type);
        ticket.setPurchaseTime(LocalDateTime.now());
        ticket.setCreatedAt(LocalDateTime.now()); // 🔥 DB için ZORUNLU

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
        return ticketRepository.findByTripId(tripId);
    }
}