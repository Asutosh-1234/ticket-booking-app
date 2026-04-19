CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0
);
INSERT INTO seats (isbooked)
SELECT 0
FROM generate_series(1, 20);

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    refresh_token TEXT
);

CREATE TABLE bookings (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    seat_id     INTEGER NOT NULL REFERENCES seats(id),
    created_at  TIMESTAMP DEFAULT NOW()
);