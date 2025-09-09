import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trophy, BookOpen, Target, Users, Clock, Award, CheckCircle, ArrowRight, Play, Zap } from "lucide-react";
import "./StudentInterviewQuiz.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/interview-quizzes";

function StudentInterviewQuiz() {
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Statistics for the intro page
  const [stats] = useState({
    totalQuestions: 500,
    passRate: 87,
    studentsHelped: 2500,
    averageImprovement: 45
  });

  // Fetch faculties
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/faculties`);
        setFaculties(res.data);
        if (res.data.length > 0) setFaculty(res.data[0].facultyName);
      } catch (err) {
        console.error("Failed to fetch faculties:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  // Update roles when faculty changes
  useEffect(() => {
    if (!faculty) return;
    const selectedFaculty = faculties.find(f => f.facultyName === faculty);
    setRoles(selectedFaculty?.roles.map(r => r.roleName) || []);
    setRole("");
    setQuestions([]);
    setCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption("");
    setQuizStarted(false);
  }, [faculty, faculties]);

  // Fetch questions when role selected
  useEffect(() => {
    if (!faculty || !role) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${faculty}/${role}`);
        setQuestions(res.data.questions || []);
        setCurrentIndex(0);
        setScore(0);
        setCompleted(false);
        setSelectedOption("");
      } catch (err) {
        console.error("Error fetching quiz:", err.response?.data || err.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [faculty, role]);

  const handleStartQuiz = () => {
    if (!role) return alert("Please select a role to start the quiz.");
    setQuizStarted(true);
  };

  const handleNext = () => {
    if (!selectedOption) return alert("Please select an option");

    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption("");
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption("");
  };

  // Completion Screen
  if (completed) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="quiz-container">
        <div className="completion-wrapper">
          <div className="completion-content">
            <div className="completion-header">
              <div className="trophy-container">
                <Trophy className="trophy-icon" />
              </div>
              <h1 className="completion-title">Quiz Completed! 🎉</h1>
              <p className="completion-score">
                Your Score: <span className="score-highlight">{score} / {questions.length}</span> ({percentage.toFixed(0)}%)
              </p>
            </div>

            <div className="badge-container">
              {percentage >= 90 ? (
                <div className="badge exceptional">
                  <Award className="badge-icon" />
                  <h2 className="badge-title">🏆 Exceptional Performance!</h2>
                  <p className="badge-description">You're ready to ace any interview!</p>
                </div>
              ) : percentage >= 70 ? (
                <div className="badge ready">
                  <CheckCircle className="badge-icon" />
                  <h2 className="badge-title">✅ Interview Ready!</h2>
                  <p className="badge-description">Great job! You have solid knowledge for interviews.</p>
                </div>
              ) : percentage >= 50 ? (
                <div className="badge learning">
                  <BookOpen className="badge-icon" />
                  <h2 className="badge-title">📚 Keep Learning!</h2>
                  <p className="badge-description">You're on the right track. Practice more to improve.</p>
                </div>
              ) : (
                <div className="badge practice">
                  <Target className="badge-icon" />
                  <h2 className="badge-title">🎯 More Practice Needed</h2>
                  <p className="badge-description">Don't give up! Focus on the fundamentals and try again.</p>
                </div>
              )}
            </div>

            <div className="completion-actions">
              <button onClick={resetQuiz} className="btn primary-btn">
                Try Another Quiz
              </button>
              <button onClick={() => window.location.reload()} className="btn secondary-btn">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Hero Section */}
      {!quizStarted && (
        <div className="hero-section">
          {/* Header */}
          <div className="hero-header">
            <div className="hero-badge">
              <Zap className="hero-badge-icon" />
              <span className="hero-badge-text">AI-Powered Interview Preparation</span>
            </div>
            <h1 className="hero-title">Master Your Interviews</h1>
            <p className="hero-description">
              Transform your interview skills with our comprehensive quiz platform. Practice real industry questions, 
              receive instant feedback, and boost your confidence to land your dream job.
            </p>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <BookOpen className="icon" />
              </div>
              <div className="stat-number">{stats.totalQuestions.toLocaleString()}+</div>
              <div className="stat-label">Practice Questions</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <Trophy className="icon" />
              </div>
              <div className="stat-number">{stats.passRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <Users className="icon" />
              </div>
              <div className="stat-number">{stats.studentsHelped.toLocaleString()}+</div>
              <div className="stat-label">Students Helped</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <Target className="icon" />
              </div>
              <div className="stat-number">{stats.averageImprovement}%</div>
              <div className="stat-label">Average Improvement</div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2 className="features-title">Why Choose Our Platform?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon blue">
                  <Star className="icon" />
                </div>
                <h3 className="feature-title">Industry-Relevant Questions</h3>
                <p className="feature-description">
                  Practice with questions designed by industry experts, covering the latest trends and technologies 
                  used in top companies worldwide.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon green">
                  <Clock className="icon" />
                </div>
                <h3 className="feature-title">Instant Feedback</h3>
                <p className="feature-description">
                  Get immediate results and detailed explanations for each answer, helping you understand 
                  concepts better and learn from mistakes.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon purple">
                  <Award className="icon" />
                </div>
                <h3 className="feature-title">Achievement Badges</h3>
                <p className="feature-description">
                  Earn badges and track your progress as you improve. Showcase your achievements 
                  and build confidence for real interviews.
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Selection */}
          <div className="selection-wrapper">
            <div className="selection-container">
              <h2 className="selection-title">Start Your Journey</h2>
              
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading options...</p>
                </div>
              ) : (
                <div className="selection-form">
                  <div className="form-group">
                    <label className="form-label">Select Faculty</label>
                    <select 
                      value={faculty} 
                      onChange={e => setFaculty(e.target.value)}
                      className="form-select"
                    >
                      {faculties.map(f => (
                        <option key={f._id} value={f.facultyName}>{f.facultyName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Select Role</label>
                    <select 
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                      disabled={roles.length === 0}
                      className="form-select"
                    >
                      <option value="">-- Select Role --</option>
                      {roles.map((r, idx) => (
                        <option key={idx} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleStartQuiz}
                    disabled={!role}
                    className="start-quiz-btn"
                  >
                    <Play className="btn-icon" />
                    Start Quiz
                    <ArrowRight className="btn-icon" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Section */}
      {quizStarted && questions.length > 0 && (
        <div className="quiz-section">
          <div className="quiz-wrapper">
            {/* Progress Bar */}
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-text">Question {currentIndex + 1} of {questions.length}</span>
                <span className="progress-text">{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="question-container">
              <h2 className="question-text">
                {questions[currentIndex].questionText}
              </h2>
              
              <div className="options-container">
                {questions[currentIndex].options.map((opt, idx) => (
                  <label 
                    key={idx} 
                    className={`option-label ${selectedOption === opt ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(opt)}
                      className="option-input"
                    />
                    <span className="option-text">{opt}</span>
                  </label>
                ))}
              </div>

              <div className="question-footer">
                <div className="score-display">
                  Score: {score} / {questions.length}
                </div>
                <button 
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="next-btn"
                >
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight className="btn-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quizStarted && questions.length === 0 && role && (
        <div className="no-questions-section">
          <div className="no-questions-container">
            <div className="no-questions-content">
              <BookOpen className="no-questions-icon" />
              <h2 className="no-questions-title">No Questions Available</h2>
              <p className="no-questions-description">
                We're currently updating questions for this role. Please try another role or check back later.
              </p>
              <button onClick={resetQuiz} className="btn primary-btn">
                Choose Another Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentInterviewQuiz;