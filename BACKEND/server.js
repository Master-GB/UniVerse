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

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// 👉 Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const mentorshipResponseRoute = require("./routes/Mentor-Route/mentornship_responseR");
const guidanceRouter = require("./routes/student_routes/guidanceR");
const resourcesRouter = require("./routes/Resource_Router/resourceRouter");
const courseRoutes = require('./routes/student_routes/course');
const enrollmentRouter = require("./routes/enrollmentR");
const interviewQuizRoutes = require("./routes/student_routes/interviewQuizRoutes"); // ✅ keep require, remove import
const PORT = process.env.PORT || 8070;  

app.use("/api/interview-quizzes", interviewQuizRoutes);
app.use("/api/courses", courseRoutes);
app.use("/guidance", guidanceRouter);
app.use("/resource", resourcesRouter);
app.use("/mentorshipResponse", mentorshipResponseRoute);
app.use('/api/enrollments', enrollmentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// JSON 404 for easier debugging in browser/devtools
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL)
  .then(() => console.log("Mongo-DB Connection Successful!"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Start server

app.listen(PORT, () => {
  console.log(`Server is up and running on port no ${PORT}`);
});
