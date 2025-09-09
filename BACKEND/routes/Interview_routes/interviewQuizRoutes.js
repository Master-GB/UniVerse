const express = require('express');
const {
  addInterviewQuiz,
  getAllInterviewQuizzes,
  updateInterviewQuiz,
  deleteInterviewQuiz
} = require('../../controllers/Interview_Controller/interviewQuizController');

const { getQuestionsByFacultyAndRole } = require('../../controllers/Interview_Controller/interviewQuizController');
const { getFaculties } = require('../../controllers/Interview_Controller/interviewQuizController');

const router = express.Router();

router.post('/', addInterviewQuiz);
router.get('/', getAllInterviewQuizzes);
router.get('/faculties', getFaculties);
// GET questions for a specific faculty and role
router.get('/:faculty/:role', getQuestionsByFacultyAndRole);
router.put('/:faculty/:role', updateInterviewQuiz);
router.delete('/:faculty/:role/:qIndex', deleteInterviewQuiz); // delete specific question

module.exports = router;
