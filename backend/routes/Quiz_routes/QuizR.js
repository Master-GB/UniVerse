const express = require('express');
const router = express.Router();
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizHistory,
  getFilterOptions
} = require('../../controllers/Quiz_Controller/QuizControllerC');

// Import your auth middleware (when you have it)
// const { protect, authorize } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all quizzes with filters
router.get('/display', getAllQuizzes);


router.get('/filters/options', getFilterOptions);


router.get('/:id', getQuizById);


router.post('/:id/submit', submitQuiz);


router.get('/results/history', getQuizHistory);

router.post('/add', createQuiz);

router.put('/:id', updateQuiz);

router.delete('/:id', deleteQuiz);

module.exports = router;