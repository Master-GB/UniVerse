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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);

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

  // Fetch career sessions from backend with cache busting
  const fetchCareerSessions = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Fetching sessions from:', `${API_BASE}/mentor-career-session/display`);
      
      // Force fresh data - bypass all caches
      const response = await axios.get(`${API_BASE}/mentor-career-session/display`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: {
          _t: Date.now(), // Cache buster timestamp
          refresh: Math.random() // Additional cache buster
        }
      });

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        length: response.data?.length
      });

      // Ensure we have an array
      const rawSessions = Array.isArray(response.data) ? response.data : [];
      console.log('📋 Raw sessions count:', rawSessions.length);

      if (rawSessions.length === 0) {
        console.log('⚠️ No sessions found in database');
        setSessions({ available: [], booked: [] });
        return;
      }

      // Map backend structure to frontend structure
      const mappedSessions = rawSessions.map((session, index) => {
        console.log(`🔄 Mapping session ${index + 1}:`, session);
        
        return {
          id: session._id,
          title: session.session_title,
          description: session.session_description,
          company: session.mentor_name,
          industry: 'Career Development',
          date: session.session_start_date ? 
                (typeof session.session_start_date === 'string' ? 
                 session.session_start_date.split('T')[0] : 
                 new Date(session.session_start_date).toISOString().split('T')[0]) : 
                new Date().toISOString().split('T')[0],
          time: session.session_start_time,
          duration: parseInt(session.session_duration) || 60,
          mentor: session.mentor_name,
          maxParticipants: session.seat_count,
          currentParticipants: 0,
          meetingLink: session.session_link,
          status: session.session_status,
          email: session.mentor_email
        };
      });

      console.log('✅ Mapped sessions:', mappedSessions);

      // Filter sessions by status - check what statuses exist in your data
      const availableSessions = mappedSessions.filter(session => {
        const availableStatuses = ['book', 'available', 'open', 'active'];
        const isAvailable = availableStatuses.includes(session.status);
        console.log(`📊 Session "${session.title}" - Status: "${session.status}", Available: ${isAvailable}`);
        return isAvailable;
      });

      const bookedSessions = mappedSessions.filter(session => {
        const bookedStatuses = ['booked', 'registered', 'confirmed'];
        return bookedStatuses.includes(session.status);
      });

      console.log('🎯 Final results:', {
        available: availableSessions.length,
        booked: bookedSessions.length
      });

      setSessions({
        available: availableSessions,
        booked: bookedSessions
      });

    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      alert('Failed to load sessions. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchCareerSessions();
  }, []);

  // Show confirmation modal before booking
  const handleBookClick = (session) => {
    setSelectedSession(session);
    setShowConfirmModal(true);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSession) return;

    try {
      console.log('Booking session:', selectedSession.id);
      
      // Call the actual booking API
      const response = await axios.post(`${API_BASE}/mentor-career-session/book`, {
        sessionId: selectedSession.id,
        // Add studentId if you have user authentication
        // studentId: getCurrentUserId()
      });

      if (response.status === 200 && response.data.success) {
        // Remove from available list and add to booked list
        const updatedSession = { ...selectedSession, status: 'booked' };
        setSessions(prevSessions => ({
          available: prevSessions.available.filter(s => s.id !== selectedSession.id),
          booked: [...prevSessions.booked, updatedSession]
        }));

        alert('Session booked successfully!');
        
        // Optionally refresh data to ensure consistency
        // fetchCareerSessions();
      } else {
        throw new Error('Booking failed');
      }

    } catch (error) {
      console.error('Error booking session:', error);
      if (error.response?.status === 400) {
        alert('This session is not available for booking.');
      } else if (error.response?.status === 404) {
        alert('Session not found.');
      } else {
        alert('Failed to book session. Please try again later.');
      }
    } finally {
      setShowConfirmModal(false);
      setSelectedSession(null);
    }
  };

  // Show cancel confirmation modal
  const handleCancelClick = (sessionId) => {
    const session = sessions.booked.find(s => s.id === sessionId);
    if (session) {
      setSessionToCancel(session);
      setShowCancelModal(true);
    }
  };

  // Handle canceling a booking
  const handleConfirmCancel = async () => {
    if (!sessionToCancel) return;

    try {
      console.log('Canceling session:', sessionToCancel.id);
      
      // Call the actual cancel API
      const response = await axios.post(`${API_BASE}/mentor-career-session/cancel`, {
        sessionId: sessionToCancel.id,
        // Add studentId if you have user authentication
        // studentId: getCurrentUserId()
      });

      if (response.status === 200 && response.data.success) {
        // Remove from booked list and add back to available list
        const updatedSession = { ...sessionToCancel, status: 'book' };
        setSessions(prevSessions => ({
          available: [...prevSessions.available, updatedSession],
          booked: prevSessions.booked.filter(s => s.id !== sessionToCancel.id)
        }));

        alert('Booking canceled successfully!');
        
        // Optionally refresh data to ensure consistency
        // fetchCareerSessions();
      } else {
        throw new Error('Cancellation failed');
      }
      
    } catch (error) {
      console.error('Error canceling booking:', error);
      if (error.response?.status === 400) {
        alert('Cannot cancel this booking at this time.');
      } else if (error.response?.status === 404) {
        alert('Session not found.');
      } else {
        alert('Failed to cancel booking. Please try again later.');
      }
    } finally {
      setShowCancelModal(false);
      setSessionToCancel(null);
    }
  };

  // Filter sessions based on search query
  const filteredSessions = sessions[activeTab].filter(session => 
    session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.mentor?.toLowerCase().includes(searchQuery.toLowerCase())
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
            Available Sessions ({sessions.available.length})
          </div>
          <div 
            className={`tab ${activeTab === 'booked' ? 'active' : ''}`}
            onClick={() => setActiveTab('booked')}
          >
            My Bookings ({sessions.booked.length})
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
            <br/>
            <small>Check the debug info above and browser console for details</small>
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
                <p className="session-description">
                  {session.description && (session.description.length > 100 
                    ? `${session.description.substring(0, 100)}...` 
                    : session.description)}
                </p>
                
                <div className="session-meta">
                  <div><Briefcase size={16} /> {session.company || 'Company TBA'}</div>
                  <div><User size={16} /> Mentor: {session.mentor || 'TBA'}</div>
                  <div><User size={16} /> Industry: {session.industry || 'General'}</div>
                  <div><Calendar size={16} /> {new Date(session.date).toLocaleDateString()}</div>
                  <div><Clock size={16} /> {session.time} ({session.duration} mins)</div>
                  {session.maxParticipants && (
                    <div>
                      <AlertCircle size={16} /> 
                      {session.currentParticipants || 0}/{session.maxParticipants} participants
                    </div>
                  )}
                  {session.status === 'booked' && session.meetingLink && (
                    <div>
                      Meeting Link: 
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="session-link"
                      >
                        Join Session
                      </a>
                    </div>
                  )}
                </div>

                {activeTab === 'available' ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleBookClick(session)}
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
                      onClick={() => handleCancelClick(session.id)}
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

      {/* Booking Confirmation Modal */}
      {showConfirmModal && selectedSession && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>Confirm Booking</h3>
            <p>Are you sure you want to book this session?</p>
            <div style={{
              margin: '1rem 0',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{selectedSession.title}</h4>
              <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {new Date(selectedSession.date).toLocaleDateString()}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Time:</strong> {selectedSession.time}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Duration:</strong> {selectedSession.duration} minutes</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Mentor:</strong> {selectedSession.mentor || 'TBA'}</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '1.5rem'
            }}>
              <button 
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && sessionToCancel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <div style={{
              margin: '1rem 0',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{sessionToCancel.title}</h4>
              <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {new Date(sessionToCancel.date).toLocaleDateString()}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Time:</strong> {sessionToCancel.time}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Mentor:</strong> {sessionToCancel.mentor || 'TBA'}</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '1.5rem'
            }}>
              <button 
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowCancelModal(false)}
              >
                Keep Booking
              </button>
              <button 
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={handleConfirmCancel}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StuCareerSession;