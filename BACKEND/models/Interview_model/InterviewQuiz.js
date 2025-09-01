const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options
  correctAnswer: { type: String, required: true },
});

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  jobType: { type: String, required: true }, // Intern, Full-time, etc.
  questions: [QuestionSchema],
});

const FacultySchema = new mongoose.Schema(
  {
    facultyName: { type: String, required: true },
    roles: [RoleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewQuiz", FacultySchema);
