import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './stu_examPastPaper.css';

// Mock data - in a real app, this would come from an API
const pastPapers = [
  {
    id: 1,
    title: "Software Engineering - 2023",
    code: "SE3080",
    year: 2023,
    semester: "1st Semester",
    questions: 8,
    timeAllowed: "3 Hours",
    fileUrl: "/papers/se_2023.pdf",
    modelAnswers: true,
    difficulty: "Medium",
    tags: ["SE", "Final Exam", "Model Answers"]
  },
  {
    id: 2,
    title: "Database Systems - 2022",
    code: "CS2052",
    year: 2022,
    semester: "2nd Semester",
    questions: 6,
    timeAllowed: "2.5 Hours",
    fileUrl: "/papers/db_2022.pdf",
    modelAnswers: true,
    difficulty: "Hard",
    tags: ["Database", "Final Exam", "Model Answers"]
  },
  {
    id: 3,
    title: "Algorithms - 2023",
    code: "CS2040",
    year: 2023,
    semester: "1st Semester",
    questions: 5,
    timeAllowed: "3 Hours",
    fileUrl: "/papers/algo_2023.pdf",
    modelAnswers: false,
    difficulty: "Hard",
    tags: ["Algorithms", "Midterm"]
  },
  {
    id: 4,
    title: "Web Development - 2023",
    code: "CS2060",
    year: 2023,
    semester: "1st Semester",
    questions: 7,
    timeAllowed: "2 Hours",
    fileUrl: "/papers/web_2023_mid.pdf",
    modelAnswers: true,
    difficulty: "Medium",
    tags: ["Web", "Midterm", "Model Answers"]
  },
  {
    id: 5,
    title: "Data Structures - 2022",
    code: "CS2030",
    year: 2022,
    semester: "2nd Semester",
    questions: 6,
    timeAllowed: "3 Hours",
    fileUrl: "/papers/ds_2022_final.pdf",
    modelAnswers: true,
    difficulty: "Hard",
    tags: ["Data Structures", "Final Exam", "Model Answers"]
  }
];

const StuExamPastPaper = ({ history }) => {
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

  const handleBack = () => {
    window.history.back();
  };

  const filteredPapers = pastPapers.filter(paper => {
    const matchesExamType = 
      filters.examType === 'all' || 
      (filters.examType === 'Midterm' && paper.tags.includes('Midterm')) ||
      (filters.examType === 'Final Exam' && paper.tags.includes('Final Exam'));
      
    const matchesSubject = 
      filters.subject === 'all' || 
      paper.code.toLowerCase() === filters.subject.toLowerCase() ||
      paper.title.toLowerCase().includes(filters.subject.toLowerCase());
      
    return (
      (filters.year === 'all' || paper.year === parseInt(filters.year)) &&
      (filters.semester === 'all' || paper.semester === filters.semester) &&
      matchesSubject &&
      matchesExamType &&
      (!filters.hasAnswers || paper.modelAnswers) &&
      (paper.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
       paper.code.toLowerCase().includes(filters.searchQuery.toLowerCase()))
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

  // Get unique values for filters
  const years = [...new Set(pastPapers.map(paper => paper.year))].sort((a, b) => b - a);
  const semesters = [...new Set(pastPapers.map(paper => paper.semester))];
  const subjects = [...new Set(pastPapers.map(paper => ({
    code: paper.code,
    name: paper.title.split(' - ')[0] // Extract subject name from title
  })))];

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
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
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