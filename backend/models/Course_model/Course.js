const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options
  correctAnswer: { type: String, required: true } // must match one option
});

const courseSchema = new mongoose.Schema({
  faculty: { type: String, required: true },
  coursename: { type: String, required: true },
  description: { type: String },
  level: { type: String, default: "Certificate Level" },
  duration: { type: String, required: true },
  image: { type: String },
  videos: { type: [String] },
  questions: [questionSchema]   // updated to use MCQ
}, { timestamps: true });

// Export only the Course model. The questionSchema is embedded in the Course schema.
module.exports = mongoose.model("Course", courseSchema);
