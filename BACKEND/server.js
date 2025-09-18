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
const interviewroutes = require("./routes/InterviewRoutes/interviewRoute_jcj");
const mentorresourcesRoute = require("./routes/Mentor-Route/mentornship_resourcehubR");
const mentorArticleRoute = require("./routes/Mentor-Route/mentornship_ArticleR");

const mentorCareerSessionRoute = require("./routes/Mentor-Route/mentornship_career_session");
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically for download/access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes
// Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/guidance", guidanceRouter);
app.use("/resource", resourcesRouter);

// Mentorship  Routes

app.use("/mentorshipResponse", mentorshipResponseRoute);
app.use("/mentorship-announcement", mentorshipAnnouncementRoute);

// Interview Route
app.use("/api/interview", interviewroutes);
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
