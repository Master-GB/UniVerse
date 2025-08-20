import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Clock, 
  Send,
  Edit3,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import "./stu_guidance.css";

const StuGuidance = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with actual API calls
  const sampleQuestions = [
    {
      id: 1,
      question: "How to improve my programming logic skills?",
      details: "I've been practicing basic problems but struggling with complex algorithms. Any specific resources or strategies?",
      date: "2023-08-20",
      status: "answered",
      mentor: "Dr. Smith",
      response: "I recommend starting with platforms like LeetCode and HackerRank. Focus on understanding patterns rather than just solving problems. Also, try to implement data structures from scratch.",
      responseDate: "2023-08-21"
    },
    {
      id: 2,
      question: "Best approach for final year project?",
      details: "I'm interested in AI but not sure what would be a good scope for a final year project.",
      date: "2023-08-22",
      status: "pending",
      mentor: "",
      response: "",
      responseDate: ""
    }
  ];

  useEffect(() => {
    // In a real app, fetch questions from your API
    setQuestions(sampleQuestions);
  }, []);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    const question = {
      id: questions.length + 1,
      question: newQuestion.split('\n')[0],
      details: newQuestion,
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      mentor: "",
      response: "",
      responseDate: ""
    };
    
    setQuestions([question, ...questions]);
    setNewQuestion('');
    setIsQuestionFormOpen(false);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || q.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="stu-guidance-wrapper">
    <div className="guidance-container">
      <div className="guidance-header">
        <h1><MessageSquare size={24} /> Ask for Guidance</h1>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search your questions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Filter size={18} className="filter-icon" />
        </div>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Questions
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'answered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('answered')}
        >
          Answered
        </button>
      </div>

      {!isQuestionFormOpen ? (
        <button 
          className="new-question-btn"
          onClick={() => setIsQuestionFormOpen(true)}
        >
          <Edit3 size={18} /> Ask a New Question
        </button>
      ) : (
        <form className="question-form" onSubmit={handleSubmitQuestion}>
          <h3>Ask Your Question</h3>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Type your question here... Be as specific as possible to get better guidance."
            rows={4}
            required
          />
          <div className="form-actions">
            <button 
              type="button" 
              className="btn secondary"
              onClick={() => setIsQuestionFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <Send size={16} /> Submit Question
            </button>
          </div>
        </form>
      )}

      <div className="questions-list">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div key={q.id} className={`question-card ${q.status}`}>
              <div className="question-header">
                <div className="question-status">
                  {q.status === 'answered' ? (
                    <CheckCircle size={16} className="answered" />
                  ) : (
                    <Clock size={16} className="pending" />
                  )}
                  <span>{q.status === 'answered' ? 'Answered' : 'Pending'}</span>
                </div>
                <div className="question-date">
                  <Calendar size={14} /> {q.date}
                </div>
              </div>
              
              <h3>{q.question}</h3>
              <p className="question-details">{q.details}</p>
              
              {q.status === 'answered' && (
                <div className="mentor-response">
                  <div className="mentor-info">
                    <User size={14} />
                    <span>Response from {q.mentor} • {q.responseDate}</span>
                  </div>
                  <p>{q.response}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-questions">
            <MessageSquare size={48} className="empty-icon" />
            <p>No questions found</p>
            <button 
              className="btn primary"
              onClick={() => setIsQuestionFormOpen(true)}
            >
              Ask your first question
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default StuGuidance;