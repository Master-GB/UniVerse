import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './stu_examQuiz.css';

const ExamQuiz = () => {
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    questions: [],
    duration: 0 // Will be set from the database
  });
  const navigate = useNavigate();

  // Fetch quiz data when component mounts
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8070/quiz/${quizId}`);
        if (response.data.success) {
          const quiz = response.data.data;
          // Get duration in minutes from database
          const quizDurationInMinutes = parseInt(quiz.duration) || 30;
          // Convert minutes to seconds for the timer
          const quizDurationInSeconds = quizDurationInMinutes * 60;
          
          console.log('Quiz duration (minutes):', quizDurationInMinutes);
          console.log('Setting timer to (seconds):', quizDurationInSeconds);
          
          setQuizData({
            title: quiz.title,
            subject: quiz.subject,
            questions: quiz.questions || [],
            duration: quizDurationInMinutes // Store in minutes
          });
          setTimeLeft(quizDurationInSeconds); // Set timer in seconds
        } else {
          setError('Failed to load quiz. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    } else {
      setError('No quiz ID provided');
      setIsLoading(false);
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && !isLoading) {
      const timer = setTimeout(() => setTimeLeft(prevTime => prevTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmit();
    }
  }, [timeLeft, quizCompleted, isLoading]);

  const handleOptionSelect = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score and time spent
    let totalScore = 0;
    const results = [];
    // Calculate time spent in minutes (convert both to minutes for calculation)
    const totalTimeMinutes = Math.max(1, Math.round(((quizData.duration * 60) - timeLeft) / 60));
    console.log('Time spent (minutes):', totalTimeMinutes);
    
    quizData.questions.forEach((question, index) => {
      const isCorrect = selectedOptions[index] === question.correctAnswer;
      if (isCorrect) {
        totalScore += question.points || 1;
      }
      results.push(selectedOptions[index] || ''); // Just send the selected answer
    });

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      setQuizCompleted(true);
      setShowResults(true);
      return;
    }

    // Save results to the server
    try {
      await axios.post(
        `http://localhost:8070/quiz/${quizId}/submit`,
        {
          answers: results,
          timeSpent: totalTimeMinutes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      console.error('Error submitting quiz:', err);
      // Continue with showing results even if submission fails
    }

    setScore(totalScore);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions([]);
    // Convert minutes to seconds when restarting
    setTimeLeft((quizData.duration || 30) * 60);
    setQuizCompleted(false);
    setScore(0);
    setShowResults(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-loading">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // Show no questions message
  if (!quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-error">
          <h3>No Questions Available</h3>
          <p>This quiz doesn't have any questions yet.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-results">
          <h2 className="exam-quiz-results-title">Quiz Results</h2>
          <p className="exam-quiz-score">Your score: {score} out of {quizData.questions.length}</p>
          <div className="exam-quiz-results-details">
            {quizData.questions.map((question, index) => (
              <div 
                key={question._id || index}
                className={`exam-quiz-result-item ${
                  selectedOptions[index] === question.correctAnswer ? 
                  'exam-quiz-correct' : 'exam-quiz-incorrect'
                }`}
              >
                <p className="exam-quiz-question-text">
                  <strong>Question {index + 1}:</strong> {question.question}
                </p>
                <p className="exam-quiz-user-answer">
                  Your answer: {selectedOptions[index] || 'Not answered'}
                </p>
                {selectedOptions[index] !== question.correctAnswer && (
                  <p className="exam-quiz-correct-answer">
                    Correct answer: {question.correctAnswer}
                    {question.explanation && (
                      <span className="exam-quiz-explanation">
                        <br />Explanation: {question.explanation}
                      </span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button className="exam-quiz-restart-btn" onClick={restartQuiz}>
            Restart Quiz
          </button>
          <button className="exam-quiz-back-btn" onClick={() => navigate(-1)}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-quiz-container">
      <div className="exam-quiz-header">
        <h2 className="exam-quiz-title">{quizData.title}</h2>
        <p className="exam-quiz-subject">{quizData.subject}</p>
        <div className="exam-quiz-timer">
          <div className={timeLeft <= 60 ? 'critical-time' : ''}>
            Time Left: {formatTime(timeLeft)}
          </div>
          <div className="exam-quiz-progress">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </div>
        </div>
      </div>

      <div className="exam-quiz-question-container">
        <h3 className="exam-quiz-question">
          {quizData.questions[currentQuestion].question}
        </h3>
        <div className="exam-quiz-options">
          {quizData.questions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              className={`exam-quiz-option ${
                selectedOptions[currentQuestion] === option ? 'exam-quiz-option-selected' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </div>
          ))}
        </div>
      </div>

      <div className="exam-quiz-navigation">
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
          className="exam-quiz-nav-btn"
        >
          Previous
        </button>
        
        {currentQuestion === quizData.questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="exam-quiz-submit-btn"
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="exam-quiz-nav-btn"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamQuiz;
