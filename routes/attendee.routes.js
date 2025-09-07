const express = require("express");
const attendeeController = require("../controllers/attendee.controller.js");

const router = express.Router();

router.post("/register", attendeeController.registerAttendee); // Register an attendee
router.get("/getAll", attendeeController.getAllAttendees); // Get all attendees
router.get("/byEvent/:eventId", attendeeController.getAttendeesByEvent); // Get attendees by event

module.exports = router;
