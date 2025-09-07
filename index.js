const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db.js");
const eventRoutes = require("./routes/event.routes.js");
const attendeeRoutes = require("./routes/attendee.routes.js");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://eventised-client-vsoo.vercel.app/",
    ],
    credentials: true,
  })
);

// Mount routes directly
app.use("/api/events", eventRoutes);
app.use("/api/attendees", attendeeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API running" });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT},`));
