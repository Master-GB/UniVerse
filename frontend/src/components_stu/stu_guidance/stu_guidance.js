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
  Filter
} from 'lucide-react';
import Toast from '../common/Toast';
import "./stu_guidance.css";

const StuGuidance = () => {
  const [questions, setQuestions] = useState([]);
  const[inputs,setInputs] = useState({
    guidanceTitle:"",
    guidanceDiscription:"",
    status: "pending",
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });


  const fetchGuidance = async () => {
  try {
    const res = await axios.get('http://localhost:8070/guidance/display');
    const raw = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.guidances)
        ? res.data.guidances
        : [];

    const mapped = raw.map(item => ({
      id: item._id,
      // Keep both naming styles so current UI and filters work
      question: item.guidanceTitle,
      guidanceTitle: item.guidanceTitle,
      details: item.guidanceDiscription,
      guidanceDiscription: item.guidanceDiscription,
      date: item.guidanceDate ? new Date(item.guidanceDate).toISOString().split('T')[0] : '',
      guidanceDate: item.guidanceDate ? new Date(item.guidanceDate).toISOString().split('T')[0] : '',
      status: (item.status || 'pending').toLowerCase(),
      mentor: item.mentorName || '',
      mentorName: item.mentorName || '',
      response: item.response || '',
      responseDate: item.responseDate ? new Date(item.responseDate).toISOString().split('T')[0] : ''
    }));

    setQuestions(mapped);
  } catch (e) {
    console.error('Error fetching guidance:', e);
    setQuestions([]); // no dummy fallback
  }
};

  // Fetch on mount
  useEffect(() => {
    fetchGuidance();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
            ...prevState,
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
      // Clear any existing toasts
      setToast({ show: false, message: '', type: '' });
      
      const response = await axios.post("http://localhost:8070/guidance/add", {
        studentGName: 'Student', // You might want to get this from user context
        guidanceTitle: inputs.guidanceTitle,
        guidanceDiscription: inputs.guidanceDiscription,
        guidanceDate: new Date().toISOString()
      });
      
      // Show success toast
      setToast({
        show: true,
        message: response.data?.message || 'Guidance submitted successfully!',
        type: 'success'
      });
      
      // Reset form
      setInputs({
        guidanceTitle: "",
        guidanceDiscription: "",
        status: "pending"
      });
      
      // Close the form
      setIsQuestionFormOpen(false);
      
      // Refresh the questions list
      const questionsResponse = await axios.get("http://localhost:8070/guidance/display");
      if (Array.isArray(questionsResponse.data) || Array.isArray(questionsResponse.data?.guidances)) {
        const raw2 = Array.isArray(questionsResponse.data) ? questionsResponse.data : questionsResponse.data.guidances;
        const formattedQuestions = raw2.map(item => ({
          id: item._id,
          question: item.guidanceTitle,
          guidanceTitle: item.guidanceTitle,
          details: item.guidanceDiscription,
          guidanceDiscription: item.guidanceDiscription,
          date: item.guidanceDate ? new Date(item.guidanceDate).toISOString().split('T')[0] : '',
          guidanceDate: item.guidanceDate ? new Date(item.guidanceDate).toISOString().split('T')[0] : '',
          status: (item.status || 'pending').toLowerCase(),
          mentor: item.mentorName || "",
          mentorName: item.mentorName || "",
          response: item.response || "",
          responseDate: item.responseDate ? new Date(item.responseDate).toISOString().split('T')[0] : ""
        }));
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error in handleSubmitQuestion:', error);
      // Only show error toast if no success toast was shown
      setToast(prev => ({
        show: true,
        message: error.response?.data?.error || 'Failed to submit guidance. Please try again.',
        type: 'error'
      }));
    }
  };

  const filteredQuestions = questions.filter(q => {
    const title = (q.guidanceTitle || q.question || '').toLowerCase();
    const desc = (q.guidanceDiscription || q.details || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesFilter = activeFilter === 'all' || q.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="stu-guidance-wrapper">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
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
          <Filter size={18} className="filter-icon" />
        </div>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Guidance
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
                  <Calendar size={14} /> {q.guidanceDate}
                </div>
              </div>
              
              <h3>{q.guidanceTitle}</h3>
              <p className="question-details">{q.guidanceDiscription}</p>
              
              {q.status === 'answered' && (
                <div className="mentor-response">
                  <div className="mentor-info">
                    <User size={14} />
                    <span>Response from {q.mentorName} • {q.responseDate}</span>
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