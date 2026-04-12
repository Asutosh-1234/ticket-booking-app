# Book My Ticket

## What is this project?
This is a simple web application that allows users to register, login and book tickets for a movie.

## What are the Tech Stack used in this project?
- Node.js
- Express.js
- PostgreSQL
- JWT
- Cookies
- HTML
- CSS
- JavaScript

## How to run this project?
1. Clone the repository
2. Install the dependencies
    - npm install
3. Connect the PostgreSQL database
```docker
docker run --name postgres-db -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=sql_class_2_db -p 5432:5432 -d postgres
```
4. Run the server
```bash
npm run start
```
5 run the sql query file 
```sql
sql_class_pg.session.sql
    -- CREATE TABLE seats (
    -- id SERIAL PRIMARY KEY,
    -- name VARCHAR(255),
    -- isbooked INT DEFAULT 0
    -- );
    -- INSERT INTO seats (isbooked)
    -- SELECT 0
-- FROM generate_series(1, 20);

-- CREATE TABLE users (
--     id          SERIAL PRIMARY KEY,
--     name        VARCHAR(100) NOT NULL,
--     email       VARCHAR(255) NOT NULL UNIQUE,
--     password    VARCHAR(255) NOT NULL,
--     refresh_token TEXT
-- );

-- CREATE TABLE bookings (
--     id          SERIAL PRIMARY KEY,
--     user_id     INTEGER NOT NULL REFERENCES users(id),
--     seat_id     INTEGER NOT NULL REFERENCES seats(id),
--     created_at  TIMESTAMP DEFAULT NOW()
-- );

```

## How to use this project?
1. Open the browser and go to the localhost:port
2. Register an account
3. Login to the account
4. Book a ticket
5. Logout from the account

## all api endpoints

- POST /api/v1/register - register a new user (body: {name, email, password})
    - response: {user, accessToken, refreshToken}
- POST /api/v1/login - login a user (body: {email, password})
    - response: {user, accessToken, refreshToken}
- POST /api/v1/logout - logout a user (body: {refresh_token})
    - response: {message}
- GET /seats - get all seats
    - response: {seats}
- PUT /:id/:name - book a seat (body: {name})
    - response: {seat, user, accessToken, refreshToken}
