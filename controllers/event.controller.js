const Event = require("../models/event.model.js");

const getAllEvents = async (req, res) => {
  try {
    const {
      _sort = "sortOrder",
      _search = "",
      _order,
      _page = 1,
      _limit,
    } = req.query;

    const page = Math.max(parseInt(_page, 10) || 1, 1);
    const limit = Math.max(parseInt(_limit, 10) || 5, 1);
    const skip = (page - 1) * limit;

    const query = _search ? { name: { $regex: _search, $options: "i" } } : null;
    const events = await Event.find(query)
      .sort({
        [_sort]: _order === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Event.countDocuments();

    res.status(200).json({ data: events, totalCount });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ startTime: { $gt: currentDate } });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createEvent = async (req, res) => {
  try {
    const { name, location, startTime, endTime, maxCapacity } = req.body;

    if (!name || !location || !startTime || !endTime || !maxCapacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExistingEvent = await Event.findOne({ name });
    if (isExistingEvent) {
      return res.status(400).json({ message: "Event name must be unique" });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time" });
    }

    // Create event
    const newEvent = new Event({
      name,
      location,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      maxCapacity,
    });
    await newEvent.save();

    res
      .status(200)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEventById,
  getAllEvents,
  getAllUpcomingEvents,
  createEvent,
};
