CREATE OR REPLACE FUNCTION set_ticket_created_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_at IS NULL THEN
        NEW.created_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ticket_created_at
BEFORE INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION set_ticket_created_at();


CREATE OR REPLACE FUNCTION check_stop_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stop_order < 1 THEN
        RAISE EXCEPTION 'stop_order 1’den küçük olamaz';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_stop_order
BEFORE INSERT OR UPDATE ON route_stops
FOR EACH ROW
EXECUTE FUNCTION check_stop_order();