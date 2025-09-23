const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const path = require("path");

const mentorshipResponseRoute = require("./routes/Mentor-Route/mentornship_responseR");
const guidanceRouter = require("./routes/student_routes/guidanceR");
const resourcesRouter = require("./routes/Resource_Router/resourceRouter");
const mentorshipAnnouncementRoute = require("./routes/Mentor-Route/mentornship_announsmentR");
const mentorresourcesRoute = require("./routes/Mentor-Route/mentornship_resourcehubR");
const mentorArticleRoute = require("./routes/Mentor-Route/mentornship_ArticleR");
const courseRouter = require("./routes/Course_routes/courseRoutes"); 
const enrollmentRouter = require("./routes/Course_routes/enrollmentR");
const interviewQuizRouter = require("./routes/InterviewRoutes/interviewRoute_jcj")

const mentorCareerSessionRoute = require("./routes/Mentor-Route/mentornship_career_session");
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching so no 304 in dev
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });
}

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/guidance", guidanceRouter);
app.use("/resource", resourcesRouter);

// Mentorship Routes
app.use("/mentorshipResponse", mentorshipResponseRoute);
app.use("/mentorship-announcement", mentorshipAnnouncementRoute);
app.use("/mentor-resourcehub", mentorresourcesRoute);
app.use("/mentor-article", mentorArticleRoute);
app.use("/mentor-career-session", mentorCareerSessionRoute);

// Course routes
app.use("/api/courses", courseRouter);
app.use("/api/enrollments", enrollmentRouter);

//interview quiz routes
app.use("/api/interviewQuiz", interviewQuizRouter);


app.use("/mentor-resourcehub",mentorresourcesRoute);
app.use("/mentor-article",mentorArticleRoute);

app.use("/mentor-career-session",mentorCareerSessionRoute);
const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo-DB Connection Successful!");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port no ${PORT}`);
});
