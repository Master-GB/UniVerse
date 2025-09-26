import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stu_examQuiz.css';

const ExamQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      points: 1
    },
    {
      id: 2,
      question: "What is the time complexity of accessing an element in an array by index?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: "O(1)",
      points: 1,
      explanation: "Array elements are stored in contiguous memory locations, allowing direct access in constant time."
    },
    {
      id: 3,
      question: "Which of the following methods adds one or more elements to the end of an array and returns the new length?",
      options: [".push()", ".pop()", ".shift()", ".unshift()"],
      correctAnswer: ".push()",
      points: 1,
      explanation: "The push() method adds elements to the end of an array and returns the new length of the array."
    },
    {
      id: 4,
      question: "What is the output of [1, 2, 3, 4].slice(1, 3) in JavaScript?",
      options: ["[1, 2]", "[2, 3]", "[1, 2, 3]", "[2, 3, 4]"],
      correctAnswer: "[2, 3]",
      points: 1,
      explanation: "The slice() method returns a shallow copy of a portion of an array. It starts at the start index (1) and goes up to, but not including, the end index (3)."
    },
    {
      id: 5,
      question: "Which array method executes a provided function once for each array element?",
      options: [".filter()", ".map()", ".forEach()", ".reduce()"],
      correctAnswer: ".forEach()",
      points: 1,
      explanation: "The forEach() method executes a provided function once for each array element."
    },
    {
      id: 6,
      question: "What does the following code return? [1, 2, 3, 4, 5].filter(num => num % 2 === 0)",
      options: ["[1, 3, 5]", "[2, 4]", "[true, false, true, false, true]", "[false, true, false, true, false]"],
      correctAnswer: "[2, 4]",
      points: 1,
      explanation: "The filter() method creates a new array with all elements that pass the test implemented by the provided function. In this case, it returns even numbers."
    },
    {
      id: 7,
      question: "What is the output of [1, 2, 3].map(num => num * 2)?",
      options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "[1, 2, 2, 4, 3, 6]"],
      correctAnswer: "[2, 4, 6]",
      points: 1,
      explanation: "The map() method creates a new array with the results of calling a provided function on every element in the array. In this case, it doubles each number."
    },
    {
      id: 8,
      question: "Which method removes the first element from an array and returns that element?",
      options: [".shift()", ".unshift()", ".pop()", ".slice()"],
      correctAnswer: ".shift()",
      points: 1,
      explanation: "The shift() method removes the first element from an array and returns that removed element, changing the length of the array."
    },
    {
      id: 9,
      question: "What does [1, 2, 3, 4].reduce((a, b) => a + b) return?",
      options: ["10", "[1, 2, 3, 4]", "[6, 4]", "24"],
      correctAnswer: "10",
      points: 1,
      explanation: "The reduce() method executes a reducer function on each element of the array, resulting in a single output value. In this case, it sums all numbers: 1+2+3+4 = 10."
    },
    {
      id: 10,
      question: "Which method returns a string representing the array elements?",
      options: [".toString()", ".join()", ".stringify()", ".concat()"],
      correctAnswer: ".toString()",
      points: 1,
      explanation: "The toString() method returns a string representing the specified array and its elements, with elements separated by commas."
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, quizCompleted]);

  const handleOptionSelect = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
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
    setTimeLeft(1800);
    setQuizCompleted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="exam-quiz-container">
        <div className="exam-quiz-results">
          <h2 className="exam-quiz-results-title">Quiz Results</h2>
          <p className="exam-quiz-score">Your score: {score} out of {questions.length}</p>
          <div className="exam-quiz-results-details">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
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
        <div className="exam-quiz-timer">Time Left: {formatTime(timeLeft)}</div>
        <div className="exam-quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="exam-quiz-question-container">
        <h3 className="exam-quiz-question">{questions[currentQuestion].question}</h3>
        <div className="exam-quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
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
        
        {currentQuestion === questions.length - 1 ? (
          <button 
            onClick={handleSubmit} 
            className="exam-quiz-submit-btn"
            disabled={!selectedOptions[currentQuestion]}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="exam-quiz-nav-btn"
            disabled={!selectedOptions[currentQuestion]}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamQuiz;