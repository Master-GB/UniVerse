import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './stu_examPastPaper.css';

const StuExamPastPaper = ({ history }) => {
  // State for storing fetched past papers
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Year level is now handled by the backend

  const [filters, setFilters] = useState({
    year: 'all',
    semester: 'all',
    subject: 'all',
    examType: 'all',
    hasAnswers: false,
    searchQuery: ''
  });

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch past papers from the backend
  useEffect(() => {
    const fetchPastPapers = async () => {
      try {
        setIsLoading(true);
        const { year, semester, subject, examType, hasAnswers, searchQuery } = filters;
        
        // Build query parameters
        const params = new URLSearchParams();
        if (year && year !== 'all') params.append('year', year);
        if (semester && semester !== 'all') params.append('semester', semester);
        if (subject && subject !== 'all') params.append('subject', subject);
        if (examType && examType !== 'all') params.append('examType', examType);
        if (hasAnswers) params.append('hasAnswers', 'true');
        if (searchQuery) params.append('searchQuery', searchQuery);

        const response = await fetch(`http://localhost:8070/passpaper/display?${params.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch past papers');
        }
        
        const data = await response.json();
        if (data.success) {
          setPapers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch past papers');
        }
      } catch (err) {
        console.error('Error fetching past papers:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastPapers();
  }, [filters]); // Re-run when filters change

  const handleBack = () => {
    window.history.back();
  };

  // Use papers from state (filtering is now done on the server)
  const filteredPapers = papers;

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

  // Get unique values for filters
  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  // These will be populated from the backend in a real app
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch filter options from the backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('http://localhost:8070/passpaper/filters/options', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSemesters(data.data.semesters || []);
            setSubjects(data.data.subjects || []);
          }
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <div className="stu-past-papers-container">
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

      <div className="stu-filters-container">
        <div className="stu-search-box">
          <input
            type="text"
            placeholder="Search papers by title or code..."
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleFilterChange}
            className="stu-search-input"
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
            name="year" 
            value={filters.year} 
            onChange={handleFilterChange}
            className="stu-year-filter"
          >
            <option value="all">All Years</option>
            {yearLevels.map((level, index) => (
              <option key={index} value={level}>{level}</option>
            ))}
          </select>

          <select 
            name="semester" 
            value={filters.semester} 
            onChange={handleFilterChange}
            className="stu-semester-filter"
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
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject.code}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
          
          <select 
            name="examType" 
            value={filters.examType}
            onChange={handleFilterChange}
            className="stu-exam-type-filter"
          >
            <option value="all">All Exam Types</option>
            <option value="Midterm">Mid Exam</option>
            <option value="Final Exam">Final Exam</option>
          </select>

          <label className="stu-checkbox-label">
            <input
              type="checkbox"
              name="hasAnswers"
              checked={filters.hasAnswers}
              onChange={handleFilterChange}
              className="stu-has-answers-checkbox"
            />
            Show only papers with model answers
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading past papers...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <div className="stu-papers-grid">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
            <motion.div 
              key={paper.id}
              className="stu-paper-card"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
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
              <div className="stu-paper-tags">
                {paper.tags.map((tag, i) => (
                  <span key={i} className="stu-tag">{tag}</span>
                ))}
              </div>
            </motion.div>
            ))
          ) : (
            <div className="stu-no-results">
              <p>No papers found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}

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