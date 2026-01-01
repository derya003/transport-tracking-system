package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Trip bazlı (zaten kullandık)
    long countByTripId(Long tripId);

    @Query("SELECT COALESCE(SUM(t.price),0) FROM Ticket t WHERE t.trip.id = :tripId")
    double sumPriceByTripId(Long tripId);

    // Route bazlı
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.trip.route.id = :routeId")
    long countByRouteId(Long routeId);

    @Query("SELECT COALESCE(SUM(t.price),0) FROM Ticket t WHERE t.trip.route.id = :routeId")
    double sumPriceByRouteId(Long routeId);

    List<Ticket> findByTripId(Long tripId);
}
