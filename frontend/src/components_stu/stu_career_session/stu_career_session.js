import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, User, Briefcase, AlertCircle, X, Video } from 'lucide-react';
import './stu_career_session.css';
import axios from 'axios';
const API_BASE = 'http://localhost:8070';

const StuCareerSession = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState({
    available: [],
    booked: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if a session is in the future
  const isFutureSession = (session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    return sessionDateTime > currentTime;
  };

  // Check if cancel is allowed (more than 12 hours before)
  const isCancelAllowed = (session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const twelveHoursBefore = new Date(sessionDateTime);
    twelveHoursBefore.setHours(twelveHoursBefore.getHours() - 12);
    return currentTime < twelveHoursBefore;
  };

  // Check if join is allowed (within 1 hour before session)
  const isJoinAllowed = (session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const oneHourBefore = new Date(sessionDateTime);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);
    return currentTime >= oneHourBefore && currentTime <= sessionDateTime;
  };

  // Format time remaining
  const getTimeRemaining = (session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const diffMs = sessionDateTime - currentTime;
    
    if (diffMs <= 0) return "Session has started";
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  };

  // Dummy data for career sessions
  const dummySessions = {
    available: [
      {
        id: '1',
        title: 'Resume Building Workshop',
        industry: 'Career Development',
        company: 'Tech Careers Inc.',
        date: '2025-09-20',
        time: '14:00',
        duration: 60,
        mentor: 'John Smith',
        description: 'Learn how to create an impressive resume that stands out to employers.',
        maxParticipants: 20,
        currentParticipants: 15,
        meetingLink: 'https://meet.google.com/abc123',
        status: 'available'
      },
      {
        id: '2',
        title: 'Interview Preparation',
        industry: 'Career Development',
        company: 'Career Boosters',
        date: '2025-09-22',
        time: '15:30',
        duration: 90,
        mentor: 'Sarah Johnson',
        description: 'Master common interview questions and techniques to ace your next job interview.',
        maxParticipants: 15,
        currentParticipants: 8,
        meetingLink: 'https://meet.google.com/def456',
        status: 'available'
      },
      {
        id: '3',
        title: 'Networking Strategies',
        industry: 'Professional Skills',
        company: 'LinkedIn',
        date: '2025-09-25',
        time: '11:00',
        duration: 60,
        mentor: 'Michael Chen',
        description: 'Learn how to build and maintain a professional network for career growth.',
        maxParticipants: 30,
        currentParticipants: 22,
        meetingLink: 'https://meet.google.com/ghi789',
        status: 'available'
      }
    ],
    booked: [
      {
        id: '4',
        title: 'Career in Tech: Panel Discussion',
        industry: 'Technology',
        company: 'Tech Industry Alliance',
        date: '2025-09-18',
        time: '16:00',
        duration: 120,
        mentor: 'Panel of Experts',
        description: 'Hear from industry experts about different career paths in technology.',
        maxParticipants: 50,
        currentParticipants: 45,
        meetingLink: 'https://meet.google.com/jkl012',
        status: 'booked'
      },
      {
        id: '5',
        title: 'Personal Branding',
        industry: 'Career Development',
        company: 'Brand You',
        date: '2025-09-28',
        time: '13:30',
        duration: 75,
        mentor: 'Emma Wilson',
        description: 'Develop your personal brand to stand out in the job market.',
        maxParticipants: 25,
        currentParticipants: 10,
        meetingLink: 'https://meet.google.com/mno345',
        status: 'booked'
      }
    ]
  };

  // Fetch career sessions
  useEffect(() => {
    const fetchCareerSessions = async () => {
      setIsLoading(true);
      try {
        
        // Use the dummy data instead of API call
        setSessions(dummySessions);
      } catch (error) {
        console.error('Error fetching career sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerSessions();
  }, []);

  // Handle booking a career session
  const handleBookSession = async (sessionId) => {
    try {
      const updatedSessions = { ...sessions };
      const session = updatedSessions.available.find(s => s.id === sessionId);
      if (session) {
        session.status = 'booked';
        setSessions({
          available: updatedSessions.available.filter(s => s.id !== sessionId),
          booked: [...updatedSessions.booked, session]
        });
      }
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  // Handle booking a session
  const handleBook = async (sessionId) => {
    const session = sessions.available.find(s => s.id === sessionId);
    if (!session || session.currentParticipants >= session.maxParticipants) {
      console.log('Cannot book: Session is full or not available');
      return;
    }

    // Optimistic UI update
    const updatedSession = { ...session, status: 'booked' };
    setSessions({
      available: sessions.available.filter(s => s.id !== sessionId),
      booked: [...sessions.booked, updatedSession]
    });

    try {
      console.log('Session booked successfully');
    } catch (error) {
      console.error('Error booking session:', error);
      // Revert on error
      setSessions({
        available: [...sessions.available, session],
        booked: sessions.booked.filter(s => s.id !== sessionId)
      });
    }
  };

  // Handle canceling a booking
  const handleCancel = async (sessionId) => {
    const session = sessions.booked.find(s => s.id === sessionId);
    if (!session) return;

    // Optimistic UI update
    const updatedSession = { ...session, status: 'available' };
    setSessions({
      available: [...sessions.available, updatedSession],
      booked: sessions.booked.filter(s => s.id !== sessionId)
    });

    try {
      console.log('Booking canceled successfully');
    } catch (error) {
      console.error('Error canceling booking:', error);
      // Revert on error
      setSessions({
        available: sessions.available.filter(s => s.id !== sessionId),
        booked: [...sessions.booked, session]
      });
    }
  };

  // Filter sessions based on search query
  const filteredSessions = sessions[activeTab].filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="session-wrapper">
      <div className="session-container">
        <h1 className="acdamic-res-title">Career Development Sessions</h1>
        <div className="session-tabs">
          <div 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Sessions
          </div>
          <div 
            className={`tab ${activeTab === 'booked' ? 'active' : ''}`}
            onClick={() => setActiveTab('booked')}
          >
            My Bookings
          </div>
        </div>

        <div className="controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search career sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading career sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="empty-state">
            {activeTab === 'available' 
              ? 'No career sessions available at the moment.' 
              : 'You have no upcoming career sessions.'}
          </div>
        ) : (
          <div className="sessions-grid">
            {filteredSessions.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-card-header">
                  <h3>{session.title}</h3>
                  {activeTab === 'booked' && (
                    <div className="session-status">
                      {isFutureSession(session) ? getTimeRemaining(session) : 'In Progress'}
                    </div>
                  )}
                </div>
                <p>{session.description}</p>
                
                <div className="session-meta">
                  <div><Briefcase size={16} /> {session.company || 'Company TBA'}</div>
                  <div><User size={16} /> Industry: {session.industry || 'General'}</div>
                  <div><Calendar size={16} /> {new Date(session.date).toLocaleDateString()}</div>
                  <div><Clock size={16} /> {session.time} ({session.duration} mins)</div>
                  {session.status === 'booked' && session.meetingLink && (
                    <div>Meeting Link: <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="session-link">Join Session</a></div>
                  )}
                </div>

                {activeTab === 'available' ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleBook(session.id)}
                    disabled={session.currentParticipants >= session.maxParticipants}
                  >
                    {session.currentParticipants < session.maxParticipants 
                      ? 'Book Session' 
                      : 'Fully Booked'}
                  </button>
                ) : (
                  <div className="session-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.open(session.meetingLink, '_blank', 'noopener,noreferrer')}
                      disabled={!isJoinAllowed(session)}
                      title={isJoinAllowed(session) ? '' : 'Available 1 hour before session'}
                    >
                      <Video size={16} /> Join Session
                    </button>
                    <button 
                      className="btn"
                      onClick={() => handleCancel(session.id)}
                      disabled={!isCancelAllowed(session)}
                      title={isCancelAllowed(session) ? '' : 'Cannot cancel within 12 hours of session'}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid var(--border)',
                        opacity: isCancelAllowed(session) ? 1 : 0.6,
                        cursor: isCancelAllowed(session) ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StuCareerSession;