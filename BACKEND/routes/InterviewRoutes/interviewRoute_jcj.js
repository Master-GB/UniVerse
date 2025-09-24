const express = require('express');
const {
  addInterviewQuiz,
  getAllInterviewQuizzes,
  updateInterviewQuiz,
  deleteInterviewQuiz,
  getQuestionsByFacultyAndRole,
  getFaculties
} = require('../../controllers/Interview-Controller/interviewController');

const router = express.Router();

// Routes
router.post('/', addInterviewQuiz);
router.get('/', getAllInterviewQuizzes);
router.get('/faculties', getFaculties); // ✅ faculties dropdown
router.get('/:faculty/:role', getQuestionsByFacultyAndRole);
router.put('/:faculty/:role', updateInterviewQuiz);
router.delete('/:faculty/:role/:qIndex', deleteInterviewQuiz);

module.exports = router;
