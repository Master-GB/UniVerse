import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Clock, 
  BookOpen, 
  Video, 
  FileText,
  ChevronRight,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import "./stu_guidance.css";

const StuGuidance = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with actual API call
  const sessions = [
    {
      id: 1,
      title: "Career Counseling Session",
      mentor: "Dr. Smith",
      date: "2023-08-25",
      time: "14:30",
      duration: "45 min",
      type: "career",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Academic Advising",
      mentor: "Prof. Johnson",
      date: "2023-08-22",
      time: "10:00",
      duration: "30 min",
      type: "academic",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Thesis Guidance",
      mentor: "Dr. Williams",
      date: "2023-08-20",
      time: "15:45",
      duration: "60 min",
      type: "thesis",
      status: "completed"
    }
  ];

  const filteredSessions = sessions.filter(session => 
    session.status === activeTab && 
    (session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     session.mentor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="guidance-container">
      <div className="guidance-header">
        <h1><MessageSquare size={24} /> Guidance Sessions</h1>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search sessions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Filter size={18} className="filter-icon" />
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <div className="sessions-grid">
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
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
      <button className="new-session-btn">
        <Plus size={20} /> Book New Session
      </button>
    </div>
  );
}

export default StuGuidance;