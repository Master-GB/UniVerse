import React, { useState, useEffect } from 'react';
import axios from "axios";
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Clock, 
  Send,
  Edit3,
  CheckCircle,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Toast from '../common/Toast';
import "./stu_guidance.css";

const StuGuidance = () => {
  const [questions, setQuestions] = useState([]);
  const [inputs, setInputs] = useState({
    guidanceTitle: "",
    guidanceDiscription: "",
    status: "pending",
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guidance data from the database
  const fetchGuidance = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:8070/guidance/display');
      console.log('API Response:', response.data);
      
      if (response.data && response.data.guidances) {
        const formattedQuestions = response.data.guidances.map(item => ({
          id: item._id,
          guidanceTitle: item.guidanceTitle,
          guidanceDiscription: item.guidanceDiscription,
          guidanceDate: item.guidanceDate ? new Date(item.guidanceDate).toLocaleDateString() : 'N/A',
          status: item.status?.toLowerCase() || 'pending',
          mentorName: item.mentorName || 'Not assigned',
          response: item.response || '',
          responseDate: item.responseDate ? new Date(item.responseDate).toLocaleDateString() : ''
        }));
        
        setQuestions(formattedQuestions);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching guidance data:', err);
      setError('Failed to load guidance data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, []);

  const refreshGuidance = async () => {
    await fetchGuidance();
    setToast({
      show: true,
      message: 'Guidance data refreshed',
      type: 'success'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!inputs.guidanceTitle.trim() || !inputs.guidanceDiscription.trim()) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    try {
      setToast({ show: false, message: '', type: '' });
      
      const response = await axios.post("http://localhost:8070/guidance/add", {
        studentGName: 'Student',
        guidanceTitle: inputs.guidanceTitle,
        guidanceDiscription: inputs.guidanceDiscription,
        guidanceDate: new Date().toISOString()
      });
      
      setToast({
        show: true,
        message: response.data?.message || 'Guidance submitted successfully!',
        type: 'success'
      });
      
      setInputs({
        guidanceTitle: "",
        guidanceDiscription: "",
        status: "pending"
      });
      
      setIsQuestionFormOpen(false);
      await fetchGuidance();
    } catch (error) {
      console.error('Error in handleSubmitQuestion:', error);
      setToast(prev => ({
        show: true,
        message: error.response?.data?.error || 'Failed to submit guidance. Please try again.',
        type: 'error'
      }));
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (!q) return false;
    const searchLower = searchQuery.toLowerCase();
    const title = q.guidanceTitle || '';
    const description = q.guidanceDiscription || '';
    const status = q.status || 'pending';
    
    const matchesSearch = title.toLowerCase().includes(searchLower) ||
                         description.toLowerCase().includes(searchLower);
    const matchesFilter = activeFilter === 'all' || status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const pendingQuestions = filteredQuestions.filter(q => q.status === 'pending');
  const answeredQuestions = filteredQuestions.filter(q => q.status === 'answered');

  const renderQuestionCard = (q) => (
    <div key={q.id} className={`question-card ${q.status}`}>
      <div className="question-header">
        <h3>{q.guidanceTitle}</h3>
        <span className={`status-badge ${q.status}`}>
          {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
        </span>
      </div>
      <p className="question-details">{q.guidanceDiscription}</p>
      <div className="question-meta">
        <span><Calendar size={14} /> {q.guidanceDate}</span>
      </div>
      
      {q.status === 'answered' && (
        <div className="mentor-response">
          <div className="response-header">
            <h4><User size={14} /> Mentor's Response</h4>
            {q.responseDate && <span className="response-date">Responded on: {q.responseDate}</span>}
          </div>
          <div className="response-content">
            <p>{q.response}</p>
            {q.mentorName && (
              <div className="mentor-info">
                <User size={14} /> {q.mentorName}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="stu-guidance-wrapper">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}
      
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
          </div>
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
            <input
              type="text"
              name="guidanceTitle"
              value={inputs.guidanceTitle}
              onChange={handleInputChange}
              placeholder="Question title"
              className="question-title-input"
              required
            />
            <textarea
              name="guidanceDiscription"
              value={inputs.guidanceDiscription}
              onChange={handleInputChange}
              placeholder="Provide details about your question... Be as specific as possible to get better guidance."
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

        <div className="questions-container">
          <div className="questions-header">
            <h2>Your Guidance Requests</h2>
            <button 
              onClick={refreshGuidance}
              className="refresh-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="spin" /> Refreshing...
                </>
              ) : 'Refresh'}
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-state">
              <Loader2 size={32} className="spin" />
              <p>Loading guidance requests...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={32} />
              <p>{error}</p>
              <button onClick={fetchGuidance} className="retry-button">
                Retry
              </button>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={48} />
              <p>No guidance requests found. {searchQuery ? 'Try a different search term.' : 'Submit a new guidance request to get started.'}</p>
            </div>
          ) : (
            <div className="questions-sections">
              {pendingQuestions.length > 0 && (
                <div className="questions-section">
                  <h3 className="section-title">
                    <Clock size={18} /> Pending Responses
                    <span className="count-badge">{pendingQuestions.length}</span>
                  </h3>
                  <div className="questions-list">
                    {pendingQuestions.map(renderQuestionCard)}
                  </div>
                </div>
              )}

              {answeredQuestions.length > 0 && (
                <div className="questions-section answered">
                  <h3 className="section-title">
                    <CheckCircle size={18} /> Responses Received
                    <span className="count-badge">{answeredQuestions.length}</span>
                  </h3>
                  <div className="questions-list">
                    {answeredQuestions.map(renderQuestionCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StuGuidance;
