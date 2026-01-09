CREATE TABLE routes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE stops (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

CREATE TABLE route_stops (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT NOT NULL,
    stop_id BIGINT NOT NULL,
    stop_order INTEGER NOT NULL,
    distance_to_next_km DOUBLE PRECISION,

    CONSTRAINT fk_route
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,

    CONSTRAINT fk_stop
        FOREIGN KEY (stop_id) REFERENCES stops(id),

    CONSTRAINT uq_route_stop_order
        UNIQUE (route_id, stop_order)
);

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    route_id BIGINT,

    CONSTRAINT fk_vehicle_route
        FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    current_stop_order INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_trip_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),

    CONSTRAINT fk_trip_route
        FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    purchase_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_ticket_trip
        FOREIGN KEY (trip_id) REFERENCES trips(id)
);