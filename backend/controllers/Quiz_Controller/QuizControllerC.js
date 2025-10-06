const Quiz = require('../../models/Quiz_model/QuestionSchema');
const QuizResult = require('../../models/Quiz_model/AnswerSchema');

// @desc    Get all quizzes with filters
// @route   GET /api/quizzes
// @access  Public/Student
exports.getAllQuizzes = async (req, res) => {
  try {
    const { year, semester, subject, search } = req.query;
    
    let query = { isActive: true };
    
    if (year && year !== 'all') {
      query.year = parseInt(year);
    }
    
    if (semester && semester !== 'all') {
      query.semester = semester;
    }
    
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    const quizzes = await Quiz.find(query)
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ updatedAt: -1 });
    
    const quizzesWithCount = quizzes.map(quiz => ({
      id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      year: quiz.year,
      semester: quiz.semester,
      questions: quiz.questions.length,
      duration: quiz.duration,
      difficulty: quiz.difficulty,
      isNew: quiz.isNew,
      lastUpdated: quiz.updatedAt
    }));
    
    res.status(200).json({
      success: true,
      count: quizzesWithCount.length,
      data: quizzesWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
};

// @desc    Get quiz by ID with questions (for taking the quiz)
// @route   GET /api/quizzes/:id
// @access  Public/Student
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Include ALL question details including correctAnswer and explanation
    const quizData = {
      id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      year: quiz.year,
      semester: quiz.semester,
      duration: quiz.duration,
      difficulty: quiz.difficulty,
      questions: quiz.questions.map(q => ({
        id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,  // ✓ Now included
        explanation: q.explanation,      // ✓ Now included
        points: q.points
      }))
    };
    
    res.status(200).json({
      success: true,
      data: quizData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};
// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private/Admin
exports.createQuiz = async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      createdBy: req.user?._id // Assuming auth middleware sets req.user
    };
    
    const quiz = await Quiz.create(quizData);
    
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};

// @desc    Delete quiz (soft delete)
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz',
      error: error.message
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const quizId = req.params.id;
    
    // Add validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format. Expected an array.'
      });
    }
    
    if (typeof timeSpent !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid timeSpent format. Expected a number.'
      });
    }
    
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    let score = 0;
    let totalPoints = 0;
    const processedAnswers = [];
    
    quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score += question.points;
      }
      
      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer || '',
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      });
    });
    
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    
    // Make student field optional for now
    const quizResult = await QuizResult.create({
      student: req.user?._id || null, // Allow null if no user
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      timeSpent
    });
    
    // Get questions with explanations for the response
    const questionsWithExplanations = quiz.questions.map((q, index) => ({
      id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: answers[index] || 'Not answered',
      isCorrect: answers[index] === q.correctAnswer
    }));
    
    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        resultId: quizResult._id,
        score,
        totalPoints,
        percentage: Math.round(percentage * 100) / 100,
        questions: questionsWithExplanations
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(400).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  }
};

// @desc    Get student's quiz history
// @route   GET /api/quizzes/results/history
// @access  Private/Student
exports.getQuizHistory = async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user._id })
      .populate('quiz', 'title subject year semester')
      .sort({ completedAt: -1 })
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz history',
      error: error.message
    });
  }
};

// @desc    Get filter options (years, subjects)
// @route   GET /api/quizzes/filters/options
// @access  Public
exports.getFilterOptions = async (req, res) => {
  try {
    const years = await Quiz.distinct('year', { isActive: true });
    const subjects = await Quiz.distinct('subject', { isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        years: years.sort((a, b) => b - a),
        subjects: subjects.sort(),
        semesters: ['1', '2']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};


