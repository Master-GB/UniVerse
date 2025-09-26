import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiAward, FiBookOpen } from 'react-icons/fi';
import './PracticeTestsOverview.css';

const PracticeTestsOverview = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    year: 'all',
    semester: 'all',
    subject: 'all',
    searchQuery: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Sample quiz data - replace with actual data
  const allQuizzes = [
    {
      id: 1,
      title: 'SE3080 - 2023',
      subject: 'Software Project Management',
      year: 2023,
      semester: '2',
      questions: 30,
      duration: 60, // minutes
      difficulty: 'Medium',
      isNew: true,
      lastUpdated: '2023-09-20'
    },
    {
      id: 2,
      title: 'SE3050 - 2023',
      subject: 'Advanced Software Engineering',
      year: 2023,
      semester: '1',
      questions: 25,
      duration: 45,
      difficulty: 'Easy',
      isNew: false,
      lastUpdated: '2023-08-15'
    },
    {
      id: 3,
      title: 'SE3070 - 2023',
      subject: 'Machine Learning',
      year: 2023,
      semester: '2',
      questions: 35,
      duration: 75,
      difficulty: 'Hard',
      isNew: true,
      lastUpdated: '2023-09-22'
    },
    {
      id: 4,
      title: 'SE3040 - 2023',
      subject: 'Database Systems',
      year: 2023,
      semester: '1',
      questions: 28,
      duration: 50,
      difficulty: 'Medium',
      isNew: false,
      lastUpdated: '2023-07-10'
    }
  ];

  // Filter quizzes based on selected filters and search query
  const filteredQuizzes = allQuizzes.filter(quiz => {
    const searchLower = filters.searchQuery.toLowerCase();
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchLower) ||
      quiz.subject.toLowerCase().includes(searchLower);
      
    return (
      (filters.year === 'all' || quiz.year === parseInt(filters.year)) &&
      (filters.semester === 'all' || quiz.semester === filters.semester) &&
      (filters.subject === 'all' || quiz.subject === filters.subject) &&
      (filters.searchQuery === '' || matchesSearch)
    );
  });
  
  // Sort quizzes: newest first
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => 
    new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );
  
  // Get unique values for filters
  const years = [...new Set(allQuizzes.map(quiz => quiz.year))].sort((a, b) => b - a);
  const semesters = ['1', '2'];
  const subjects = [...new Set(allQuizzes.map(quiz => quiz.subject))].sort();

  const handleStartQuiz = (quizId) => {
    navigate(`/student/exam/practice-tests/quiz/${quizId}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="practice-tests-overview">
      <button 
        onClick={handleBack} 
        className="back-button"
        aria-label="Go back to previous page"
      >
        ← Back
      </button>
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="practice-tests-title">
          Practice <span className="practice-tests-gradient">Tests</span>
        </h1>
        <p className="page-subtitle">Test your knowledge with our comprehensive practice tests</p>
      </motion.div>
      
      <div className="filters-container">
        <div className="filters-row">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by course code or subject..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              className="search-input"
            />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <select 
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select 
                value={filters.semester}
                onChange={(e) => setFilters({...filters, semester: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="filter-group">
              <select 
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            className="clear-filters"
            onClick={() => setFilters({
              year: 'all',
              semester: 'all',
              subject: 'all',
              searchQuery: ''
            })}
            disabled={filters.year === 'all' && filters.semester === 'all' && filters.subject === 'all' && filters.searchQuery === ''}
          >
            Clear all filters
          </button>
        </div>
      </div>

      <div className="quizzes-header">
        <h3>{sortedQuizzes.length} {sortedQuizzes.length === 1 ? 'quiz' : 'quizzes'} found</h3>
      </div>

      {isLoading ? (
        <div className="quizzes-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="quiz-card-skeleton">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line subject"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-button"></div>
            </div>
          ))}
        </div>
      ) : sortedQuizzes.length > 0 ? (
        <div className="quizzes-grid">
          {sortedQuizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              {quiz.isNew && <span className="new-badge">New</span>}
              <div className="quiz-card-header">
                <h3>{quiz.title}</h3>
                <span className={`difficulty-badge ${quiz.difficulty.toLowerCase()}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <div className="quiz-card-subject">
                <FiBookOpen className="icon" />
                <span>{quiz.subject}</span>
              </div>
              <div className="quiz-card-details">
                <div className="detail-item">
                  <span className="detail-label">Year/Semester:</span>
                  <span className="detail-value">{quiz.year} - Semester {quiz.semester}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Questions:</span>
                  <span className="detail-value">{quiz.questions} questions</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <div className="duration">
                    <FiClock className="icon" />
                    <span>{quiz.duration} min</span>
                  </div>
                </div>
              </div>
              <div className="quiz-card-footer">
                <span className="last-updated">Updated: {new Date(quiz.lastUpdated).toLocaleDateString()}</span>
                <button 
                  className="start-quiz-btn"
                  onClick={() => handleStartQuiz(quiz.id)}
                  aria-label={`Start ${quiz.title} quiz`}
                >
                  Start Test
                  <FiAward className="btn-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-illustration">
            <div className="magnifying-glass">
              <div className="handle"></div>
            </div>
          </div>
          <h3>No quizzes found</h3>
          <p>We couldn't find any quizzes matching your filters. Try adjusting your search or filters.</p>
          <button 
            className="clear-filters-btn"
            onClick={() => setFilters({
              year: 'all',
              semester: 'all',
              subject: 'all',
              searchQuery: ''
            })}
          >
            Clear all filters
          </button>
        </div>
      )}
      
      <div className="quiz-tips">
        <h4>Tips for Success</h4>
        <ul>
          <li>Take practice tests in a quiet environment to simulate exam conditions</li>
          <li>Review your answers after completing each test</li>
          <li>Focus on understanding concepts you got wrong</li>
          <li>Time yourself to improve your time management skills</li>
        </ul>
      </div>
    </div>
  );
};

export default PracticeTestsOverview;
