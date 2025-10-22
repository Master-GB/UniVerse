const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedAnswer: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  points: {
    type: Number,
    default: 0
  }
});

const quizResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Changed from true to false
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
quizResultSchema.index({ student: 1, quiz: 1 });
quizResultSchema.index({ completedAt: -1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;