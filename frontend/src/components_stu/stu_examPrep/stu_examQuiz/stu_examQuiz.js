import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './stu_examQuiz.css';
import axios from 'axios';

const ExamQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quizData, setQuizData] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Fetch quiz data on component mount
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) {
        console.log('No quizId found in URL params');
        setError('No quiz ID provided');
        setIsLoading(false);
        return;
      }

      console.log('Loading quiz with ID:', quizId);
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching quiz with ID:', quizId);
        const response = await axios.get(`http://localhost:8070/quiz/${quizId}`);
        
        console.log('API Response:', response.data);
        
        if (response.data.success && response.data.data) {
          const quiz = response.data.data;
          console.log('Quiz Data:', quiz);
          
          if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
            setError('This quiz has no questions');
            setIsLoading(false);
            return;
          }
          
          setQuizData(quiz);
          setTimeLeft(quiz.duration * 60);
          setStartTime(Date.now());
          setSelectedOptions(new Array(quiz.questions.length).fill(null));
        } else {
          console.error('Invalid response structure:', response.data);
          setError('Quiz not found or unavailable');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        console.error('Error details:', err.response?.data);
        
        if (err.response?.status === 404) {
          setError('Quiz not found');
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load quiz. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizData && !quizCompleted) {
      handleSubmit();
    }
  }, [timeLeft, quizCompleted, quizData]);

  const fetchQuizData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching quiz with ID:', quizId); // Debug log
      const response = await axios.get(`http://localhost:8070/quiz/${quizId}`);
      
      console.log('API Response:', response.data); // Debug log
      
      if (response.data.success && response.data.data) {
        const quiz = response.data.data;
        console.log('Quiz Data:', quiz); // Debug log
        
        // Validate quiz structure
        if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
          setError('This quiz has no questions');
          setIsLoading(false);
          return;
        }
        
        setQuizData(quiz);
        setTimeLeft(quiz.duration * 60); // Convert minutes to seconds
        setStartTime(Date.now());
        setSelectedOptions(new Array(quiz.questions.length).fill(null));
      } else {
        console.error('Invalid response structure:', response.data);
        setError('Quiz not found or unavailable');
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      console.error('Error details:', err.response?.data);
      
      if (err.response?.status === 404) {
        setError('Quiz not found');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load quiz. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    if (quizCompleted) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    console.log('Submitting quiz with:', {
      quizId,
      answers: selectedOptions,
      timeSpent,
      answersCount: selectedOptions.length
    });
    
    try {
      const response = await axios.post(`http://localhost:8070/quiz/${quizId}/submit`, {
        answers: selectedOptions,
        timeSpent: timeSpent
      });
      
      console.log('Submit response:', response.data);
      
      if (response.data.success && response.data.data) {
        setQuizResult(response.data.data);
        setQuizCompleted(true);
        setShowResults(true);
      } else {
        alert('Failed to submit quiz. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert('Failed to submit quiz. Please try again.');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const restartQuiz = () => {
    navigate(0); // Reload the page to restart
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="exam-quiz-back-btn">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults && quizResult) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-results">
          <h2 className="exam-quiz-results-title">Quiz Results</h2>
          <div className="exam-quiz-score-summary">
            <p className="exam-quiz-score">
              Score: {quizResult.score} / {quizResult.totalPoints}
            </p>
            <p className="exam-quiz-percentage">
              Percentage: {quizResult.percentage.toFixed(2)}%
            </p>
          </div>
          
          <div className="exam-quiz-results-details">
            {quizResult.questions && quizResult.questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`exam-quiz-result-item ${
                  question.isCorrect ? 'exam-quiz-correct' : 'exam-quiz-incorrect'
                }`}
              >
                <p className="exam-quiz-question-text">
                  <strong>Question {index + 1}:</strong> {question.question}
                </p>
                
                <div className="exam-quiz-options-display">
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex}
                      className={`exam-quiz-option-display ${
                        option === question.correctAnswer ? 'correct-option' : ''
                      } ${
                        option === question.userAnswer && !question.isCorrect ? 'incorrect-option' : ''
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                      {option === question.correctAnswer && (
                        <span className="option-badge correct">✓ Correct</span>
                      )}
                      {option === question.userAnswer && !question.isCorrect && (
                        <span className="option-badge incorrect">✗ Your answer</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <p className="exam-quiz-user-answer">
                  <strong>Your answer:</strong> {question.userAnswer || 'Not answered'}
                </p>
                
                {!question.isCorrect && (
                  <p className="exam-quiz-correct-answer">
                    <strong>Correct answer:</strong> {question.correctAnswer}
                  </p>
                )}
                
                {question.explanation && (
                  <div className="exam-quiz-explanation">
                    <strong>Explanation:</strong>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="exam-quiz-results-actions">
            <button className="exam-quiz-restart-btn" onClick={restartQuiz}>
              Retake Quiz
            </button>
            <button className="exam-quiz-back-btn" onClick={() => navigate('/student/exam/practice-tests')}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-error">
          <h2>Quiz Unavailable</h2>
          <p>This quiz has no questions or is unavailable.</p>
          <button onClick={() => navigate(-1)} className="exam-quiz-back-btn">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-quiz-container">
      <div className="exam-quiz-header">
        <div className="exam-quiz-info">
          <h2>{quizData.title}</h2>
          <p>{quizData.subject}</p>
        </div>
        <div className="exam-quiz-meta">
          <div className="exam-quiz-timer">
            <span>Time Left:</span>
            <span className={timeLeft < 300 ? 'time-warning' : ''}>
              {formatTime(timeLeft)}
            </span>
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
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
        
        <div className="exam-quiz-question-info">
          <span>Points: {quizData.questions[currentQuestion].points}</span>
        </div>
      </div>

      <div className="exam-quiz-navigation">
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
          className="exam-quiz-nav-btn"
        >
          ← Previous
        </button>
        
        <div className="exam-quiz-question-indicator">
          {quizData.questions.map((_, index) => (
            <div
              key={index}
              className={`question-dot ${
                selectedOptions[index] !== null ? 'answered' : ''
              } ${
                index === currentQuestion ? 'active' : ''
              }`}
              onClick={() => setCurrentQuestion(index)}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>
        
        {currentQuestion === quizData.questions.length - 1 ? (
          <button 
            onClick={handleSubmit} 
            className="exam-quiz-submit-btn"
            disabled={quizCompleted}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="exam-quiz-nav-btn"
          >
            Next →
          </button>
        )}
      </div>
      
      <div className="exam-quiz-footer">
        <p>
          {selectedOptions.filter(opt => opt !== null).length} / {quizData.questions.length} questions answered
        </p>
      </div>
    </div>
  );
};

export default ExamQuiz;