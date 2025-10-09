import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './stu_examPastPaper.css';

const API_BASE_URL = 'http://localhost:5000/api/pastpapers'; // Update with your backend URL

const StuExamPastPaper = ({ history }) => {
  const [pastPapers, setPastPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    academicYear: 'all',
    semester: 'all',
    subject: 'all',
    examType: 'all',
    hasAnswers: false,
    searchQuery: ''
  });

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  // Function to get academic year (now using the year directly from the database)
  const getAcademicYear = (paperYear) => {
    // If paperYear is already in the format '1st Year', '2nd Year', etc., return it directly
    if (typeof paperYear === 'string' && /^\d+(st|nd|rd|th) Year$/.test(paperYear)) {
      return paperYear;
    }
    
    // Fallback to the old calculation if needed (for backward compatibility)
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const academicYearStart = currentMonth < 4 ? currentYear - 1 : currentYear;
      const yearDiff = academicYearStart - parseInt(paperYear) + 1;
      
      if (yearDiff < 1) return null;
      if (yearDiff === 1) return '1st Year';
      if (yearDiff === 2) return '2nd Year';
      if (yearDiff === 3) return '3rd Year';
      return '4th Year';
    } catch (e) {
      console.warn('Error calculating academic year:', e);
      return null;
    }
  };

  const filteredPapers = pastPapers.filter(paper => {
    if (!paper) return false;
    
    // Debug log to check paper data
    console.log('Processing paper:', { 
      id: paper._id, 
      title: paper.title, 
      year: paper.year,
      academicYear: getAcademicYear(paper.year)
    });
    
    const matchesExamType = 
      filters.examType === 'all' || 
      (filters.examType === 'Midterm' && paper.tags?.includes('Midterm')) ||
      (filters.examType === 'Final Exam' && paper.tags?.includes('Final Exam'));
      
    const matchesSubject = 
      filters.subject === 'all' || 
      (paper.code && paper.code.toLowerCase() === filters.subject.toLowerCase()) ||
      (paper.title && paper.title.toLowerCase().includes(filters.subject.toLowerCase()));
    
    const paperAcademicYear = getAcademicYear(paper.year);
    
    // Debug log for academic year matching
    const academicYearMatch = filters.academicYear === 'all' || 
                             paperAcademicYear === filters.academicYear;
    
    console.log('Academic year check:', {
      filter: filters.academicYear,
      paperYear: paper.year,
      calculated: paperAcademicYear,
      matches: academicYearMatch
    });
      
    return (
      academicYearMatch &&
      (filters.semester === 'all' || paper.semester === filters.semester) &&
      matchesSubject &&
      matchesExamType &&
      (!filters.hasAnswers || paper.modelAnswers) &&
      (paper.title && paper.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
       paper.code && paper.code.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openPaper = (paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  // Fetch past papers from API
  useEffect(() => {
    const fetchPastPapers = async () => {
      try {
        setLoading(true);
        console.log('Fetching past papers from:', `${API_BASE_URL}/display`);
        const response = await axios.get(`${API_BASE_URL}/display`);
        console.log('API Response:', response);
        
        if (response.data && response.data.success) {
          const papers = response.data.data || [];
          console.log('Fetched papers:', papers);
          setPastPapers(papers);
          
          // Log filter options for debugging
          const years = [...new Set(papers.map(p => getAcademicYear(p.year)))].filter(Boolean);
          const sems = [...new Set(papers.map(p => p.semester).filter(Boolean))];
          console.log('Available academic years:', years);
          console.log('Available semesters:', sems);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Invalid response from server. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching past papers:', err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load past papers'}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          setError('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', err.message);
          setError('Failed to load past papers. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPastPapers();
  }, []);

  // Get unique values for filters
  const academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const semesters = [...new Set(pastPapers.map(paper => paper.semester).filter(Boolean))];
  const subjects = [...new Set(
    pastPapers
      .filter(paper => paper.code && paper.title)
      .map(paper => ({
        code: paper.code,
        name: paper.title.split(' - ')[0] // Extract subject name from title
      }))
  )];

  // Show loading indicator in the papers section
  const renderLoadingState = () => (
    <div className="loading-state" style={{ 
      gridColumn: '1 / -1', 
      textAlign: 'center', 
      padding: '3rem 0',
      background: 'var(--glass)',
      borderRadius: 'var(--border-radius)',
      marginTop: '2rem'
    }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
      <p>Loading past papers...</p>
      <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        Please wait while we fetch the latest exam papers
      </p>
    </div>
  );

  // Show error state in the papers section
  const renderErrorState = () => (
    <div className="error-state" style={{ 
      gridColumn: '1 / -1', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      textAlign: 'center', 
      padding: '2rem',
      background: 'var(--glass)',
      borderRadius: 'var(--border-radius)',
      margin: '2rem auto',
      maxWidth: '600px',
      width: '100%',
      border: '1px solid rgba(255, 107, 107, 0.2)'
    }}>
      <div className="error-icon" style={{ marginBottom: '1.5rem' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1.5rem' }}>Unable to Load Past Papers</h3>
      <p className="error-message" style={{ 
        marginBottom: '2rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
        maxWidth: '500px'
      }}>
        {error}
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="retry-button"
        style={{
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '0.8rem 2rem',
          borderRadius: '50px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18-5M22 12.5a10 10 0 0 1-18 5"></path>
        </svg>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="stu-past-papers-container">
      {/* Keep the back button and header at the top */}
      <button 
        onClick={handleBack} 
        className="back-button"
        aria-label="Go back to previous page"
      >
        ← Back
      </button>
      
      <motion.div 
        className="stu-past-papers-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="stu-past-papers-title">
          Past Exam <span className="stu-past-papers-gradient">Papers</span>
        </h1>
        <p className="stu-past-papers-subtitle">Practice with previous years' exam papers and model answers</p>
      </motion.div>

      {/* Keep the filters and search section */}
      <div className="stu-filters-container">
        <div className="stu-search-box">
          <input
            type="text"
            placeholder="Search papers by title or code..."
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleFilterChange}
            className="stu-search-input"
            disabled={loading}
          />
          <span className="stu-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>

        <div className="stu-filter-group">
          <select 
            name="academicYear" 
            value={filters.academicYear} 
            onChange={handleFilterChange}
            className="stu-year-filter"
            disabled={loading}
          >
            <option value="all">All Years</option>
            {academicYears.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>

          <select 
            name="semester" 
            value={filters.semester} 
            onChange={handleFilterChange}
            className="stu-semester-filter"
            disabled={loading}
          >
            <option value="all">All Semesters</option>
            {semesters.map((sem, index) => (
              <option key={index} value={sem}>{sem}</option>
            ))}
          </select>

          <select 
            name="subject" 
            value={filters.subject} 
            onChange={handleFilterChange}
            className="stu-subject-filter"
            disabled={loading}
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub, index) => (
              <option key={index} value={sub.code}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>

          <select 
            name="examType" 
            value={filters.examType} 
            onChange={handleFilterChange}
            className="stu-exam-type-filter"
            disabled={loading}
          >
            <option value="all">All Types</option>
            <option value="Midterm">Midterm</option>
            <option value="Final Exam">Final Exam</option>
          </select>

          <label className="stu-checkbox-label">
            <input
              type="checkbox"
              name="hasAnswers"
              checked={filters.hasAnswers}
              onChange={handleFilterChange}
              className="stu-checkbox"
              disabled={loading}
            />
            <span>With Model Answers</span>
          </label>
        </div>
      </div>

      {/* Papers section - show loading/error state or papers */}
      <div className="stu-papers-grid">
        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <motion.div
              key={paper._id || paper.id}
              className="stu-paper-card"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => openPaper(paper)}
            >
              <div className="stu-paper-header">
                <h3>{paper.title}</h3>
                <span className="stu-paper-code">{paper.code}</span>
              </div>
              <div className="stu-paper-details">
                <span>📅 {paper.year} • {paper.semester}</span>
                <span>⏱️ {paper.timeAllowed}</span>
                <span>❓ {paper.questions} Questions</span>
                {paper.modelAnswers && <span className="stu-has-answers">✅ Model Answers</span>}
              </div>
              {paper.tags && paper.tags.length > 0 && (
                <div className="stu-paper-tags">
                  {paper.tags.map((tag, i) => (
                    <span key={i} className="stu-tag">{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="no-results" style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem 0',
            color: 'var(--text-secondary)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, marginBottom: '1rem' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h3>No papers found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedPaper && (
          <motion.div 
            className="stu-paper-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              className="stu-modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="stu-close-modal"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
              
              <h2>{selectedPaper.title} ({selectedPaper.code})</h2>
              <div className="stu-modal-details">
                <p><strong>Year:</strong> {selectedPaper.year}</p>
                <p><strong>Semester:</strong> {selectedPaper.semester}</p>
                <p><strong>Time Allowed:</strong> {selectedPaper.timeAllowed}</p>
                <p><strong>Questions:</strong> {selectedPaper.questions}</p>
                <p><strong>Difficulty:</strong> {selectedPaper.difficulty}</p>
              </div>

              <div className="stu-modal-actions">
                <a 
                  href={selectedPaper.fileUrl} 
                  className="stu-btn stu-btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 View Paper
                </a>
                {selectedPaper.modelAnswers && (
                  <a 
                    href={`${selectedPaper.fileUrl}-answers`} 
                    className="stu-btn stu-btn-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📝 View Model Answers
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StuExamPastPaper;