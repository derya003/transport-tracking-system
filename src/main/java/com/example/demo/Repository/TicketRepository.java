package com.example.demo.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // Tarih bazlı sorgular (PostgreSQL için CAST kullanılıyor)
    @Query("SELECT COUNT(t) FROM Ticket t WHERE CAST(t.purchaseTime AS date) = :date")
    long countByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(t.price),0) FROM Ticket t WHERE CAST(t.purchaseTime AS date) = :date")
    double sumPriceByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.purchaseTime >= :startDate AND t.purchaseTime < :endDate")
    long countByDateRange(@Param("startDate") LocalDateTime startDate, 
                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(t.price),0) FROM Ticket t WHERE t.purchaseTime >= :startDate AND t.purchaseTime < :endDate")
    double sumPriceByDateRange(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);
}
