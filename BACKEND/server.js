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
const interviewQuizRouter = require("./routes/Interview_routes/interviewQuizRoutes");
const interviewroutes = require("./routes/InterviewRoutes/interviewRoute_jcj");

const mentorCareerSessionRoute = require("./routes/Mentor-Route/mentornship_career_session");
const PORT = process.env.PORT || 8070;

app.use(cors());

// Parse JSON and capture raw body for debugging malformed JSON issues
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        req.rawBody = buf.toString(encoding || "utf8");
      } catch (e) {
        req.rawBody = undefined;
      }
    },
  })
);

// Note: bodyParser.json() would duplicate parsing here, so we rely on express.json above
app.use(express.urlencoded({ extended: true }));

// Disable caching so no 304 in dev
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
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

// Interview Route
app.use("/api/interview", interviewroutes);
// Course routes
app.use("/api/courses", courseRouter);
app.use("/api/enrollments", enrollmentRouter);

//interview quiz routes
app.use("/api/interviewQuiz", interviewQuizRouter);
app.use("/api/interview", interviewroutes);

app.use("/mentor-resourcehub", mentorresourcesRoute);
app.use("/mentor-article", mentorArticleRoute);

app.use("/mentor-career-session", mentorCareerSessionRoute);

const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo-DB Connection Successful!");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port no ${PORT}`);
});

// Better JSON parse error messages for debugging malformed requests
app.use((err, req, res, next) => {
  if (
    err &&
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    console.error("JSON Syntax Error:", err.message);
    console.error(
      "Raw body received (first 2000 chars):",
      req.rawBody?.slice(0, 2000)
    );
    return res.status(400).send(`Invalid JSON: ${err.message}`);
  }
  next(err);
});
