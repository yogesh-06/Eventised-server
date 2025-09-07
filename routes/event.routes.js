const express = require("express");
const eventController = require("../controllers/event.controller.js");

const router = express.Router();

router.post("/create", eventController.createEvent);
router.get("/getAll", eventController.getAllEvents);
router.get("/getById/:eventId", eventController.getEventById);
router.get("/getAllUpcoming", eventController.getAllUpcomingEvents);

module.exports = router;
