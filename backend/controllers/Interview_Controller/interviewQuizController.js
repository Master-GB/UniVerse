const InterviewQuiz = require('../../models/Interview_model/InterviewQuiz');

// Add new question
const addInterviewQuiz = async (req, res) => {
  try {
    const { facultyName, roleName, jobType, question } = req.body;

    if (!facultyName || !roleName || !jobType || !question)
      return res.status(400).json({ message: "All fields are required" });

    if (!question.questionText || !question.options || question.options.length !== 4 || !question.correctAnswer)
      return res.status(400).json({ message: "Each question must have text, 4 options, and a correct answer" });

    let faculty = await InterviewQuiz.findOne({ facultyName });

    if (!faculty) {
      faculty = new InterviewQuiz({
        facultyName,
        roles: [{ roleName, jobType, questions: [question] }],
      });
    } else {
      let role = faculty.roles.find(r => r.roleName === roleName);
      if (!role) {
        faculty.roles.push({ roleName, jobType, questions: [question] });
      } else {
        role.questions.push(question);
        role.jobType = jobType;
      }
    }

    await faculty.save();
    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Failed to add quiz question", error: err.message });
  }
};

// Get all quizzes
const getAllInterviewQuizzes = async (req, res) => {
  try {
    const quizzes = await InterviewQuiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quizzes", error: err.message });
  }
};

// Get questions by faculty & role
const getQuestionsByFacultyAndRole = async (req, res) => {
  try {
    const { faculty, role } = req.params;
    const facultyDoc = await InterviewQuiz.findOne({ facultyName: faculty });
    if (!facultyDoc) return res.status(404).json({ message: "Faculty not found" });

    const roleData = facultyDoc.roles.find(r => r.roleName === role);
    if (!roleData) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({
      questions: roleData.questions || [],
      jobType: roleData.jobType || null,
      roleName: roleData.roleName,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", error: err.message });
  }
};


// Update quiz
const updateInterviewQuiz = async (req, res) => {
  try {
    const { faculty, role } = req.params;
    const { questions, jobType } = req.body;

    const facultyDoc = await InterviewQuiz.findOne({ facultyName: faculty });
    if (!facultyDoc) return res.status(404).json({ message: "Faculty not found" });

    const roleData = facultyDoc.roles.find(r => r.roleName === role);
    if (!roleData) return res.status(404).json({ message: "Role not found" });

    if (questions) roleData.questions = questions;
    if (jobType) roleData.jobType = jobType;

    await facultyDoc.save();
    res.status(200).json(facultyDoc);
  } catch (err) {
    res.status(500).json({ message: "Failed to update quiz", error: err.message });
  }
};

// Delete question
const deleteInterviewQuiz = async (req, res) => {
  try {
    const { faculty, role, qIndex } = req.params;
    const facultyDoc = await InterviewQuiz.findOne({ facultyName: faculty });
    if (!facultyDoc) return res.status(404).json({ message: "Faculty not found" });

    const roleData = facultyDoc.roles.find(r => r.roleName === role);
    if (!roleData) return res.status(404).json({ message: "Role not found" });

    roleData.questions = roleData.questions.filter((_, idx) => idx !== parseInt(qIndex));
    await facultyDoc.save();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question", error: err.message });
  }
};

// In your interviewQuizController.js - update getFaculties function
const getFaculties = async (req, res) => {
  try {
    const faculties = await InterviewQuiz.find({}, 'facultyName roles.roleName roles.jobType');
    res.status(200).json(faculties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch faculties", error: err.message });
  }
};

module.exports = {
  addInterviewQuiz,
  getAllInterviewQuizzes,
  getQuestionsByFacultyAndRole,
  getFaculties,
  updateInterviewQuiz,
  deleteInterviewQuiz
};
