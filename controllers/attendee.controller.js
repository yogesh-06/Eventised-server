const Attendee = require("../models/attendee.model.js");
const Event = require("../models/event.model.js");

const registerAttendee = async (req, res) => {
  try {
    const { name, email, eventId } = req.body;

    if (!name || !email || !eventId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExistingAttendee = await Attendee.find({ email });
    if (isExistingAttendee.length) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendeeCount = await Attendee.countDocuments({ eventId });
    if (attendeeCount >= event.maxCapacity) {
      return res.status(400).json({ message: "Event is at full capacity" });
    }

    const newAttendee = new Attendee({ name, email, eventId });
    await newAttendee.save();

    event.attendeesCount += 1;
    await event.save();

    res.status(201).json({
      message: "Attendee registered successfully",
      attendee: newAttendee,
    });
  } catch (error) {
    console.error("Error registering attendee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAttendees = async (req, res) => {
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

    const query = _search
      ? { email: { $regex: _search, $options: "i" } }
      : null;

    const attendees = await Attendee.find(query)
      .sort({
        [_sort]: _order === "asc" ? 1 : -1,
      })
      .populate("eventId", "name")
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Attendee.countDocuments();

    res.status(200).json({ data: attendees, totalCount });
  } catch (error) {
    console.error("Error fetching attendees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendeesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendees = await Attendee.find({ eventId });
    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error fetching attendees by event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerAttendee,
  getAllAttendees,
  getAttendeesByEvent,
};
