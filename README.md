# Eventised - Backend

Backend for the **Eventised** project, built with **Node.js**, **Express**, and **MongoDB**.  
Provides APIs for managing events, attendees, and admin functionality.

---

## Features

- RESTful APIs for events and attendees
- Create, read, and manage events
- Register attendees with max capacity validation
- Get all attendees or attendees per event
- MongoDB database with Mongoose models
- Server-side validation and error handling
- Pagination and filtering support

---

## Tech Stack

- **Node.js** (v18+)
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Cors**, **dotenv**, and other packages

---

## Getting Started

1. Clone the repository:

-```bash
git clone https://github.com/yogesh-06/Eventised-server.git
cd Eventised-server

## API Endpoints

- Events and Attendees

# BASE_URL = https://eventised-server.onrender.com/api

- GET /events/getAll → Get all events (for Admin with pagination)
- POST /events/create → Create a new event
- GET /events/getById/:eventId → Get event by ID
- GET /events/getAllUpcoming → Get all upcoming events

- GET /attendees/getAll → Get all attendees (for Admin with pagination)
- GET /attendees/register → Register attendees to an event
- GET /attendees/byEvent/:eventId → Get attendees of a specific event

---

# Deployments

- ## Render : https://eventised-server.onrender.com/api/health

---

# Notes:

- Stack choice: MERN (Node.js + Express + MongoDB) instead of Laravel + SQLite due to local environment issues. I tried have project(non-working) attached in zip.
- Architecture follows MVC: models, routes, controllers.
- Validation included for max capacity and duplicate registration.

--

## Schema

1. # Attendees:

   - const attendeeSchema = new mongoose.Schema(
     {
     name: { type: String, required: true },
     email: { type: String, required: true },
     eventId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Event",
     required: true,
     },
     },
     { timestamps: true }
     );

--

2. # Events

   - const eventSchema = new mongoose.Schema(
     {
     name: { type: String, required: true, unique: true },
     location: { type: String, required: true },
     startTime: { type: Date, required: true },
     endTime: { type: Date, required: true },
     maxCapacity: { type: Number, required: true },
     attendeesCount: { type: Number, default: 0 },
     },
     { timestamps: true }
     );
