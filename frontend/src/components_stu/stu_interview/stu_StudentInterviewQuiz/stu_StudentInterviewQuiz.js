import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight, Play, BookOpen, Trophy, CheckCircle, Award, Target, Star, Users, Clock, Brain, Zap, TrendingUp, Medal, BookMarked } from "lucide-react";
import "./stu_StudentInterviewQuiz.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/interviewquiz";

const StudentInterviewQuiz = () => {
  // State management
  const [currentStep, setCurrentStep] = useState("intro");
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [jobType, setJobType] = useState("");
  const [difficulties] = useState(["Easy", "Medium", "Hard"]);
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState("");

  // Apply CSS class to <body>
  useEffect(() => {
    document.body.classList.add("studentinterview-body");
    return () => {
      document.body.classList.remove("studentinterview-body");
    };
  }, []);

  // Fetch faculties from backend API
  const fetchFaculties = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/faculties`);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform the backend data to match our frontend structure
        const transformedFaculties = response.data.map(faculty => ({
          _id: faculty._id,
          facultyName: faculty.facultyName,
          roles: faculty.roles || []
        }));
        setFaculties(transformedFaculties);
      } else {
        setError("Unexpected data format from server");
      }
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
      setError("Failed to load faculties. Please try again later.");
      // Fallback to mock data if API fails (remove in production)
      setFaculties([
        { _id: "1", facultyName: "Computing", roles: [{ roleName: "Software Developer" }, { roleName: "Data Analyst" }] },
        { _id: "2", facultyName: "Business", roles: [{ roleName: "Marketing Manager" }, { roleName: "Business Analyst" }] },
        { _id: "3", facultyName: "Engineering", roles: [{ roleName: "Civil Engineer" }, { roleName: "Mechanical Engineer" }] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch faculties on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  // Update roles and job types when faculty changes
  useEffect(() => {
    if (!faculty) {
      setRoles([]);
      setJobTypes([]);
      setRole("");
      setJobType("");
      return;
    }

    const selectedFaculty = faculties.find(f => f.facultyName === faculty);
    if (selectedFaculty && selectedFaculty.roles) {
      const uniqueRoles = selectedFaculty.roles.map(r => r.roleName).filter((role, index, self) => self.indexOf(role) === index);
      setRoles(uniqueRoles);
      
      // Extract unique job types from roles
      const allJobTypes = selectedFaculty.roles
        .map(r => r.jobType)
        .filter(jobType => jobType)
        .filter((jobType, index, self) => self.indexOf(jobType) === index);
      
      setJobTypes(allJobTypes);
    } else {
      setRoles([]);
      setJobTypes([]);
    }
    
    setRole("");
    setJobType("");
  }, [faculty, faculties]);

  // Fetch questions from backend API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!faculty || !role) {
        setError("Faculty and role are required");
        return;
      }

      const response = await axios.get(`${API_URL}/${faculty}/${role}`);
      
      if (response.data && response.data.questions) {
        // Filter questions by jobType and difficulty if specified
        let filteredQuestions = response.data.questions;
        
        if (jobType) {
          filteredQuestions = filteredQuestions.filter(q => q.jobType === jobType);
        }
        
        if (difficulty) {
          filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
        }

        if (filteredQuestions.length === 0) {
          setError(`No questions found for ${role} role${jobType ? ` (${jobType})` : ""}${difficulty ? ` with ${difficulty.toLowerCase()} difficulty` : ""}`);
          setQuestions([]);
          return;
        }

        // Shuffle questions and select up to 10
        const shuffledQuestions = filteredQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(10, filteredQuestions.length));

        setQuestions(shuffledQuestions);
        setCurrentIndex(0);
        setSelectedOption("");
        setScore(0);
        setUserAnswers([]);
      } else {
        setError("No questions available for this selection");
        setQuestions([]);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const startQuizSelection = () => {
    setCurrentStep("selection");
    setError("");
  };

  const startQuiz = async () => {
    if (!faculty || !role) {
      setError("Please select faculty and role to start the quiz.");
      return;
    }

    await fetchQuestions();
    
    if (questions.length > 0) {
      setCurrentStep("quiz");
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      setError("Please select an option before proceeding.");
      return;
    }

    const newAnswer = {
      question: questions[currentIndex].questionText,
      selectedAnswer: selectedOption,
      correctAnswer: questions[currentIndex].correctAnswer,
      isCorrect: selectedOption === questions[currentIndex].correctAnswer
    };

    setUserAnswers(prev => [...prev, newAnswer]);

    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption("");
      setError("");
    } else {
      setCurrentStep("results");
    }
  };

  const resetQuiz = () => {
    setCurrentStep("intro");
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption("");
    setUserAnswers([]);
    setFaculty("");
    setRole("");
    setJobType("");
    setDifficulty("");
    setQuestions([]);
    setError("");
  };

  // Intro Page
  if (currentStep === "intro") {
    return (
      <div className="studentinterview-container">
        <div className="studentinterview-content">
          {/* Hero Section */}
          <div className="studentinterview-intro-hero">
            <h1 className="studentinterview-intro-title">
              🎯 Interview Quiz Challenge
            </h1>
            <p className="studentinterview-intro-subtitle">
              Master your interview skills with our comprehensive quiz platform
            </p>
            <button className="studentinterview-get-started-btn" onClick={startQuizSelection}>
              <Play size={20} /> Get Started <ArrowRight size={20} />
            </button>
          </div>

          {/* Features Grid */}
          <div className="studentinterview-features-grid">
            <div className="studentinterview-feature-card">
              <div className="studentinterview-feature-icon">
                <Brain size={50} style={{ color: "#4ECDC4" }} />
              </div>
              <h3 className="studentinterview-feature-title">Smart Questions</h3>
              <p className="studentinterview-feature-description">
                Choose from Easy, Medium, and Hard difficulty levels tailored to your experience
              </p>
            </div>

            <div className="studentinterview-feature-card">
              <div className="studentinterview-feature-icon">
                <Target size={50} style={{ color: "#FF6B6B" }} />
              </div>
              <h3 className="studentinterview-feature-title">Role-Specific</h3>
              <p className="studentinterview-feature-description">
                Questions customized for your specific role and job type preferences
              </p>
            </div>

            <div className="studentinterview-feature-card">
              <div className="studentinterview-feature-icon">
                <TrendingUp size={50} style={{ color: "#45B7D1" }} />
              </div>
              <h3 className="studentinterview-feature-title">Track Progress</h3>
              <p className="studentinterview-feature-description">
                Detailed performance analytics and improvement suggestions
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="studentinterview-loading">
              <p>Loading faculties...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="studentinterview-error">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Selection Page
  if (currentStep === "selection") {
    return (
      <div className="studentinterview-selection-container">
        <div className="studentinterview-selection-wrapper">
          <div className="studentinterview-selection-form">
            <h2 className="studentinterview-selection-title">
              <BookMarked style={{ color: "#667eea" }} /> Customize Your Quiz
            </h2>

            {error && (
              <div className="studentinterview-error-message">
                {error}
              </div>
            )}

            <div className="studentinterview-selection-fields">
              {/* Faculty Selection */}
              <div className="studentinterview-field-group">
                <label className="studentinterview-field-label">Faculty:</label>
                <select 
                  value={faculty} 
                  onChange={e => {
                    setFaculty(e.target.value);
                    setError("");
                  }}
                  className="studentinterview-field-select"
                  required
                >
                  <option value="">-- Select Faculty --</option>
                  {faculties.map(f => (
                    <option key={f._id} value={f.facultyName}>
                      {f.facultyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Selection */}
              <div className="studentinterview-field-group">
                <label className="studentinterview-field-label">Role:</label>
                <select 
                  value={role} 
                  onChange={e => {
                    setRole(e.target.value);
                    setError("");
                  }}
                  disabled={!faculty}
                  className="studentinterview-field-select"
                  required
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
                {!faculty && <small className="studentinterview-field-hint">Select a faculty first</small>}
              </div>

              {/* Job Type Selection */}
              <div className="studentinterview-field-group">
                <label className="studentinterview-field-label">Job Type:</label>
                <select 
                  value={jobType} 
                  onChange={e => {
                    setJobType(e.target.value);
                    setError("");
                  }}
                  disabled={!role}
                  className="studentinterview-field-select"
                >
                  <option value="">-- Any Job Type --</option>
                  {jobTypes.map((j, idx) => (
                    <option key={idx} value={j}>{j}</option>
                  ))}
                </select>
                {!role && <small className="studentinterview-field-hint">Select a role first</small>}
              </div>

              {/* Difficulty Selection */}
              <div className="studentinterview-field-group">
                <label className="studentinterview-field-label">Difficulty Level:</label>
                <div className="studentinterview-difficulty-grid">
                  {difficulties.map((d, idx) => {
                    const isSelected = difficulty === d;
                    const difficultyClass = d.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDifficulty(d);
                          setError("");
                        }}
                        className={`studentinterview-difficulty-btn ${difficultyClass} ${isSelected ? 'selected' : ''}`}
                      >
                        {d === "Easy" && <Zap size={20} />}
                        {d === "Medium" && <Star size={20} />}
                        {d === "Hard" && <Medal size={20} />}
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Questions Info */}
              {role && (
                <div className="studentinterview-questions-info">
                  <BookOpen size={16} />
                  <span>Questions will be loaded for: {role}</span>
                  {jobType && <span> • {jobType}</span>}
                  {difficulty && <span> • {difficulty}</span>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="studentinterview-action-buttons">
                <button
                  onClick={() => setCurrentStep("intro")}
                  className="studentinterview-back-btn"
                >
                  ← Back
                </button>
                <button
                  onClick={startQuiz}
                  disabled={!faculty || !role || loading}
                  className="studentinterview-start-quiz-btn"
                >
                  {loading ? "Loading..." : <><Play size={20} /> Start Quiz <ArrowRight size={20} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Page
  if (currentStep === "quiz") {
    if (loading) {
      return (
        <div className="studentinterview-quiz-container">
          <div className="studentinterview-quiz-wrapper">
            <div className="studentinterview-loading">
              <p>Loading questions...</p>
            </div>
          </div>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="studentinterview-quiz-container">
          <div className="studentinterview-quiz-wrapper">
            <div className="studentinterview-no-questions">
              <BookOpen size={50} />
              <p>No questions available for this selection.</p>
              <p className="studentinterview-no-questions-hint">{error || "Please try another combination."}</p>
              <button className="studentinterview-back-btn" onClick={() => setCurrentStep("selection")}>
                Choose Another
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="studentinterview-quiz-container">
        <div className="studentinterview-quiz-wrapper">
          <div className="studentinterview-quiz-content">
            {/* Error Message */}
            {error && (
              <div className="studentinterview-error-message">
                {error}
              </div>
            )}

            {/* Progress Section */}
            <div className="studentinterview-progress-section">
              <div className="studentinterview-progress-info">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="studentinterview-progress-bar">
                <div 
                  className="studentinterview-progress-fill"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="studentinterview-question-section">
              <h2 className="studentinterview-question-text">
                {questions[currentIndex].questionText}
              </h2>
              {questions[currentIndex].difficulty && (
                <div className={`studentinterview-question-difficulty ${questions[currentIndex].difficulty.toLowerCase()}`}>
                  {questions[currentIndex].difficulty}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="studentinterview-options-grid">
              {questions[currentIndex].options.map((opt, idx) => (
                <label 
                  key={idx} 
                  className={`studentinterview-option-label ${selectedOption === opt ? 'selected' : ''}`}
                >
                  <input 
                    type="radio" 
                    checked={selectedOption === opt} 
                    onChange={() => setSelectedOption(opt)}
                    className="studentinterview-option-radio"
                  />
                  <span className="studentinterview-option-text">{opt}</span>
                </label>
              ))}
            </div>

            {/* Next Button */}
            <div className="studentinterview-next-section">
              <button className="studentinterview-next-btn" onClick={handleNext}>
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (currentStep === "results") {
    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    let badge, message;
    
    if (percentage >= 90) {
      badge = { icon: <Award size={50} />, text: "Exceptional!", color: "#FFD700" };
      message = "Outstanding performance! You're definitely interview ready!";
    } else if (percentage >= 70) {
      badge = { icon: <CheckCircle size={50} />, text: "Interview Ready!", color: "#4ECDC4" };
      message = "Great job! You have solid knowledge for interviews.";
    } else if (percentage >= 50) {
      badge = { icon: <BookOpen size={50} />, text: "Keep Learning!", color: "#FFD93D" };
      message = "Good start! A bit more practice will make you interview ready.";
    } else {
      badge = { icon: <Target size={50} />, text: "More Practice Needed", color: "#FF6B6B" };
      message = "Keep practicing! Review the topics and try again.";
    }

    return (
      <div className="studentinterview-results-container">
        <div className="studentinterview-results-wrapper">
          <div className="studentinterview-results-content">
            <h1 className="studentinterview-results-title">🎉 Quiz Completed!</h1>
            
            {/* Score Display */}
            <div className="studentinterview-score-display">
              <div className="studentinterview-score-number" style={{ color: badge.color }}>
                {score}/{questions.length}
              </div>
              <div className="studentinterview-score-percentage">
                {percentage.toFixed(0)}% Score
              </div>
            </div>

            {/* Badge */}
            <div className="studentinterview-badge-container">
              {badge.icon}
              <span className="studentinterview-badge-text">{badge.text}</span>
            </div>

            <p className="studentinterview-results-message">{message}</p>

            {/* Quiz Summary */}
            <div className="studentinterview-quiz-summary">
              <h3 className="studentinterview-summary-title">Quiz Summary</h3>
              <div className="studentinterview-summary-grid">
                <div className="studentinterview-summary-item">
                  <div className="studentinterview-summary-label">Faculty</div>
                  <div className="studentinterview-summary-value">{faculty}</div>
                </div>
                <div className="studentinterview-summary-item">
                  <div className="studentinterview-summary-label">Role</div>
                  <div className="studentinterview-summary-value">{role}</div>
                </div>
                <div className="studentinterview-summary-item">
                  <div className="studentinterview-summary-label">Job Type</div>
                  <div className="studentinterview-summary-value">{jobType || "All"}</div>
                </div>
                <div className="studentinterview-summary-item">
                  <div className="studentinterview-summary-label">Difficulty</div>
                  <div className="studentinterview-summary-value">{difficulty || "All"}</div>
                </div>
                <div className="studentinterview-summary-item">
                  <div className="studentinterview-summary-label">Questions</div>
                  <div className="studentinterview-summary-value">{questions.length}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="studentinterview-final-buttons">
              <button onClick={resetQuiz} className="studentinterview-retry-btn">
                <Play size={20} /> Take Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentInterviewQuiz;