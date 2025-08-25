const express = require("express");
const router = express.Router();
const Course = require("../../models/Course_model/Course");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ------------------- Ensure uploads folder exists -------------------
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ------------------- Multer Config -------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // use full path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ------------------- Add Course -------------------
router.post("/", upload.single("image"), async (req, res) => {
  const { name, faculty, duration, description, level, content } = req.body;
  const image = req.file ? req.file.filename : null;

  const course = new Course({
    name,
    faculty,
    duration,
    description,
    level,
    image,
    content: JSON.parse(content), // frontend sends array of strings as JSON
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------- Get All Courses -------------------
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- Delete Course -------------------
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- Update Course -------------------
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, faculty, duration, description, level, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        faculty,
        duration,
        description,
        level,
        ...(image && { image }),
        content: JSON.parse(content),
      },
      { new: true }
    );

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
