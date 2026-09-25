# Car Rental System Backend

A REST API for a car rental system built as a learning project.

## Tech Stack

* Bun
* Express.js
* TypeScript
* PostgreSQL
* JWT
* bcrypt
* Zod

## Features

* User signup and login
* JWT authentication
* Password hashing with bcrypt
* Create and manage bookings
* Booking status management
* User-specific bookings
* Request validation with Zod
* PostgreSQL enum for booking status

## Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd car-rental-system-backend
bun install
```

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Run the database schema:

```bash
psql -U postgres -d your_database -f schema.sql
```

Start the server:

```bash
bun run dev
```

## API Endpoints

### Auth

```text
POST /auth/signup
POST /auth/login
```

### Bookings

```text
POST   /bookings
GET    /bookings
GET    /bookings?summary=true
GET    /bookings/:bookingId
PUT    /bookings/:bookingId
DELETE /bookings/:bookingId
```

Protected routes require:

```text
Authorization: Bearer <token>
```

### Booking Status

```text
booked
completed
cancelled
```

New bookings are created with `booked` status.

## Validation

Zod is used to validate incoming request data, while PostgreSQL constraints and enums provide database-level validation.

## Purpose

Built to practice backend development, REST APIs, authentication, authorization, SQL, PostgreSQL, TypeScript, and Express.js.
