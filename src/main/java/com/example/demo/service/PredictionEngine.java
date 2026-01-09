package com.example.demo.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Route;
import com.example.demo.entity.RouteStop;
import com.example.demo.entity.Trip;

/**
 * Gelişmiş Tahmin Motoru
 * - Saat bazlı trafik yoğunluğu
 * - Mesafe bazlı hesaplama
 * - Durak bekleme süreleri
 */
@Service
public class PredictionEngine {

    // Ortalama hızlar (km/h) - saat bazlı
    private static final double MORNING_RUSH_HOUR_SPEED = 20.0; // 07:00-09:00
    private static final double EVENING_RUSH_HOUR_SPEED = 18.0; // 17:00-19:00
    private static final double NORMAL_HOUR_SPEED = 35.0; // Normal saatler
    private static final double NIGHT_SPEED = 45.0; // 22:00-06:00

    // Durak başına ortalama bekleme süresi (dakika)
    private static final double STOP_WAIT_TIME_MINUTES = 1.0;

    /**
     * Sefer için toplam ETA hesapla (dakika)
     */
    public long calculateTripEta(Trip trip) {
        if (!trip.isActive()) {
            return 0;
        }

        Route route = trip.getRoute();
        List<RouteStop> routeStops = route.getRouteStops();
        
        if (routeStops.isEmpty()) {
            return 0;
        }

        int currentOrder = trip.getCurrentStopOrder();
        double totalMinutes = 0.0;

        // Kalan duraklar arası mesafeleri hesapla
        for (int i = currentOrder - 1; i < routeStops.size() - 1; i++) {
            RouteStop currentStop = routeStops.get(i);
            Double distanceKm = currentStop.getDistanceToNextKm();

            if (distanceKm != null && distanceKm > 0) {
                // Mevcut saate göre hız belirle
                double speedKmH = getCurrentSpeed();
                
                // Mesafe / Hız = Saat
                double hours = distanceKm / speedKmH;
                double minutes = hours * 60;
                totalMinutes += minutes;
            }

            // Durak bekleme süresi ekle (son durak hariç)
            if (i < routeStops.size() - 1) {
                totalMinutes += STOP_WAIT_TIME_MINUTES;
            }
        }

        return Math.round(totalMinutes);
    }

    /**
     * Belirli bir durağa ETA hesapla (dakika)
     */
    public long calculateEtaToStop(Trip trip, Long stopId) {
        if (!trip.isActive()) {
            return -1; // Sefer aktif değil
        }

        Route route = trip.getRoute();
        List<RouteStop> routeStops = route.getRouteStops();
        
        // Hedef durağı bul
        RouteStop targetStop = routeStops.stream()
                .filter(rs -> rs.getStop().getId().equals(stopId))
                .findFirst()
                .orElse(null);

        if (targetStop == null) {
            return -1; // Durak bu hatta yok
        }

        int currentOrder = trip.getCurrentStopOrder();
        int targetOrder = targetStop.getStopOrder();

        // Eğer hedef durak geçildiyse
        if (targetOrder < currentOrder) {
            return 0; // Zaten geçildi
        }

        // Eğer şu anki duraktaysa
        if (targetOrder == currentOrder) {
            return 0; // Zaten burada
        }

        double totalMinutes = 0.0;
        double speedKmH = getCurrentSpeed();

        // Mevcut duraktan hedef durağa kadar
        for (int i = currentOrder - 1; i < targetOrder - 1; i++) {
            RouteStop currentStop = routeStops.get(i);
            Double distanceKm = currentStop.getDistanceToNextKm();

            if (distanceKm != null && distanceKm > 0) {
                double hours = distanceKm / speedKmH;
                double minutes = hours * 60;
                totalMinutes += minutes;
            }

            // Durak bekleme süresi (hedef durak hariç)
            if (i < targetOrder - 1) {
                totalMinutes += STOP_WAIT_TIME_MINUTES;
            }
        }

        return Math.round(totalMinutes);
    }

    /**
     * Mevcut saate göre ortalama hız belirle (km/h)
     */
    private double getCurrentSpeed() {
        LocalTime now = LocalTime.now();
        int hour = now.getHour();

        // Sabah yoğun saatleri (07:00-09:00)
        if (hour >= 7 && hour < 9) {
            return MORNING_RUSH_HOUR_SPEED;
        }
        
        // Akşam yoğun saatleri (17:00-19:00)
        if (hour >= 17 && hour < 19) {
            return EVENING_RUSH_HOUR_SPEED;
        }
        
        // Gece saatleri (22:00-06:00)
        if (hour >= 22 || hour < 6) {
            return NIGHT_SPEED;
        }
        
        // Normal saatler
        return NORMAL_HOUR_SPEED;
    }
}


