const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 👉 Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const mentorshipResponseRoute = require("./routes/Mentor-Route/mentornship_responseR");
const guidanceRouter = require("./routes/student_routes/guidanceR");
const resourcesRouter = require("./routes/Resource_Router/resourceRouter");
const courseRouter = require("./routes/Course_routes/courseRoutes");

app.use("/api/courses", courseRouter);
app.use("/guidance", guidanceRouter);
app.use("/resource", resourcesRouter);
app.use("/mentorshipResponse", mentorshipResponseRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL)
  .then(() => console.log("Mongo-DB Connection Successful!"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Start server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is up and running on port no ${PORT}`);
});
