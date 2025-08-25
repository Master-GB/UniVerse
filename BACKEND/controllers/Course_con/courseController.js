const courses = require('../models/courseModel');

// Get all courses or filter by faculty
const getAllCourses = (req, res) => {
  const { faculty } = req.query;
  if(faculty && faculty !== "All Categories") {
    const filtered = courses.filter(c => c.faculty === faculty);
    return res.json(filtered);
  }
  res.json(courses);
}

// Get course by ID
const getCourseById = (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
}

module.exports = {
  getAllCourses,
  getCourseById
};
