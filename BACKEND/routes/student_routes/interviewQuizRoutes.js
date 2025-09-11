const express = require('express');
const {
  addInterviewQuiz,
  getAllInterviewQuizzes,
  updateInterviewQuiz,
  deleteInterviewQuiz,
  getQuestionsByFacultyAndRole,
  getFaculties
} = require('../../controllers/Student-Controller/interviewQuizController');
// const courseRouter = require('./routes/Course_routes/courseRoutes');

const router = express.Router();

router.post('/', addInterviewQuiz);
router.get('/', getAllInterviewQuizzes);
router.get('/faculties', getFaculties);
// GET questions for a specific faculty and role
router.get('/:faculty/:role', getQuestionsByFacultyAndRole);
router.put('/:faculty/:role', updateInterviewQuiz);
router.delete('/:faculty/:role/:qIndex', deleteInterviewQuiz); // delete specific question

module.exports = router;
