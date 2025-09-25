const Course = require('../../models/Course_model/Course');

// ✅ Create new course (compatible with form-data fields from frontend)
const createCourse = async (req, res) => {
  try {
  console.log('createCourse called. req.body keys:', Object.keys(req.body || {}));
  if (req.file) console.log('createCourse uploaded file:', req.file.filename);
    // accept both coursename (API) and name (frontend form)
    const coursename = req.body.coursename || req.body.name;
    const faculty = req.body.faculty;
    const duration = req.body.duration;
    const description = req.body.description || req.body.desc;

    if (!coursename || !faculty || !duration) {
      return res.status(400).json({ message: "Faculty, course name and duration are required" });
    }

    // parse videos if sent as JSON string
    let videos = [];
    if (req.body.videos) {
      try {
        videos = typeof req.body.videos === 'string' ? JSON.parse(req.body.videos) : req.body.videos;
        if (!Array.isArray(videos)) videos = [];
      } catch (e) {
        // maybe newline separated string
        videos = String(req.body.videos).split('\n').map(v => v.trim()).filter(Boolean);
      }
    }

    const imageFilename = req.file ? req.file.filename : (req.body.image || undefined);

    const newCourse = new Course({
      coursename,
      faculty,
      duration,
      description,
      videos,
      image: imageFilename,
      questions: [],
    });

    await newCourse.save();
    // return wrapped data for compatibility with frontend logic
    res.status(201).json({ data: newCourse });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add course", error: err.message });
  }
};

// ✅ Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

// ✅ Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: err.message });
  }
};

// ✅ Update course (details or questions)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
  // accept name or coursename from form-data
  const coursename = req.body.coursename || req.body.name;
  const faculty = req.body.faculty;
  const duration = req.body.duration;
  const description = req.body.description || req.body.desc;
  const questions = req.body.questions;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

  // If questions exist in request → validate & update them
    if (questions) {
      for (let q of questions) {
        if (!q.questionText) {
          return res
            .status(400)
            .json({ message: "Each question must include text" });
        }
        if (!q.options || q.options.length !== 4) {
          return res.status(400).json({
            message: "Each question must include exactly 4 options",
          });
        }
        if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
          return res.status(400).json({
            message:
              "Each question must include a valid correct answer (must match one of the options)",
          });
        }
      }
      course.questions = questions;
    }

    // Update details if provided
    if (coursename) course.coursename = coursename;
    if (faculty) course.faculty = faculty;
    if (duration) course.duration = duration;
    if (description) course.description = description;

    // handle videos update if provided (could be JSON string)
    if (req.body.videos) {
      try {
        const vids = typeof req.body.videos === 'string' ? JSON.parse(req.body.videos) : req.body.videos;
        course.videos = Array.isArray(vids) ? vids : course.videos;
      } catch (e) {
        course.videos = String(req.body.videos).split('\n').map(v => v.trim()).filter(Boolean);
      }
    }

    // handle uploaded image via multer
    if (req.file) {
      course.image = req.file.filename;
    }

    await course.save();
    res.status(200).json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update course", error: err.message });
  }
};

// ✅ Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete course", error: err.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
