import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, User, Video, AlertCircle, X } from 'lucide-react';
import './stu_session.css';

const StuSession = () => {
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
    }, 60000); // Update every minute
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

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data with future dates
        const mockAvailable = [
          {
            id: 1,
            title: 'Data Structures Workshop',
            mentor: 'Dr. Smith',
            date: '2025-08-21',
            time: '00:15',
            duration: '2h',
            seats: 0
          },
          {
            id: 2,
            title: 'Web Development Bootcamp',
            mentor: 'Prof. Johnson',
            date: '2025-08-26',
            time: '10:00',
            duration: '3h',
            seats: 3
          }
        ];

        const mockBooked = [
          {
            id: 3,
            title: 'React Masterclass',
            mentor: 'Alex Chen',
            date: '2025-08-24',
            time: '15:00',
            duration: '2h'
          },
          {
            id: 4,
            title: 'Machine Learning Basics',
            mentor: 'Dr. Lee',
            date: '2025-08-27',
            time: '13:30',
            duration: '2.5h'
          }
        ];

        // Filter out past sessions
        const now = new Date();
        const futureAvailable = mockAvailable.filter(session => 
          new Date(`${session.date}T${session.time}`) > now
        );

        const futureBooked = mockBooked.filter(session => 
          new Date(`${session.date}T${session.time}`) > now
        );

        setSessions({
          available: futureAvailable,
          booked: futureBooked
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleBook = (sessionId) => {
    const session = sessions.available.find(s => s.id === sessionId);
    // Check if session exists, has seats, and user hasn't already booked it
    if (!session || session.seats <= 0 || sessions.booked.some(s => s.id === sessionId)) {
      return;
    }

    setSessions(prev => {
      // Decrease available seats
      const updatedAvailable = prev.available.map(s => 
        s.id === sessionId ? { ...s, seats: s.seats - 1 } : s
      ).filter(s => s.seats > 0);
      
      // Add to booked
      const sessionToBook = { ...session };
      delete sessionToBook.seats; // Remove seats property for booked sessions
      
      return {
        available: updatedAvailable,
        booked: [...prev.booked, sessionToBook]
      };
    });
  };

  const handleCancel = (sessionId) => {
    const session = sessions.booked.find(s => s.id === sessionId);
    if (!session) return;

    setSessions(prev => {
      // Remove from booked
      const updatedBooked = prev.booked.filter(s => s.id !== sessionId);
      
      // Add back to available with 1 seat
      const sessionToAdd = { 
        ...session,
        seats: 1 // Reset seats when cancelling
      };
      
      // Check if session already exists in available (in case of multiple seats)
      const existingIndex = prev.available.findIndex(s => s.id === sessionId);
      let updatedAvailable = [...prev.available];
      
      if (existingIndex >= 0) {
        // If exists, increment seats
        updatedAvailable = updatedAvailable.map(s => 
          s.id === sessionId ? { ...s, seats: s.seats + 1 } : s
        );
      } else {
        // Otherwise add new entry
        updatedAvailable = [...updatedAvailable, sessionToAdd];
      }

      return {
        available: updatedAvailable,
        booked: updatedBooked
      };
    });
  };

  const filteredSessions = (type) => {
    let sessionList = [...sessions[type]];
    
    // If showing available sessions, filter out any that are already booked
    if (type === 'available') {
      const bookedSessionIds = new Set(sessions.booked.map(s => s.id));
      sessionList = sessionList.filter(session => !bookedSessionIds.has(session.id));
    }
    
    // Apply search filter
    return sessionList.filter(session => 
      (session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.mentor.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div className="session-wrapper">
      <div className="session-container">
        <div className="session-tabs">
          <button 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Sessions
          </button>
          <button 
            className={`tab ${activeTab === 'booked' ? 'active' : ''}`}
            onClick={() => setActiveTab('booked')}
          >
            My Bookings
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading sessions...</div>
        ) : (
          <div className="sessions-grid">
            {filteredSessions(activeTab).length === 0 ? (
              <div className="empty-state">
                {activeTab === 'available' 
                  ? 'No available sessions found' 
                  : 'No booked sessions found'}
              </div>
            ) : (
              filteredSessions(activeTab).map(session => {
                const sessionDateTime = new Date(`${session.date}T${session.time}`);
                const canCancel = isCancelAllowed(session);
                const canJoin = isJoinAllowed(session);
                const isFuture = isFutureSession(session);

                return (
                  <div key={session.id} className="session-card">
                    <div className="session-card-header">
                      <h3>{session.title}</h3>
                      {activeTab === 'booked' && (
                        <div className="session-status">
                          {isFuture ? getTimeRemaining(session) : 'In Progress'}
                        </div>
                      )}
                    </div>
                    
                    <div className="session-meta">
                      <div><User size={14} /> {session.mentor}</div>
                      <div><Calendar size={14} /> {new Date(session.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {session.time}</div>
                      <div><Clock size={14} /> {session.duration}</div>
                      {activeTab === 'available' && (
                        <div>Seats left: {session.seats}</div>
                      )}
                    </div>

                    {activeTab === 'available' ? (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleBook(session.id)}
                        disabled={session.seats <= 0}
                      >
                        {session.seats > 0 ? 'Book Session' : 'Fully Booked'}
                      </button>
                    ) : (
                      <div className="session-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={() => window.open('#', '_blank')}
                          disabled={!canJoin}
                          title={canJoin ? '' : 'Available 1 hour before session'}
                        >
                          <Video size={16} /> Join Session
                        </button>
                        <button 
                          className="btn"
                          onClick={() => handleCancel(session.id)}
                          disabled={!canCancel}
                          title={canCancel ? '' : 'Cannot cancel within 12 hours of session'}
                          style={{ 
                            background: 'transparent', 
                            border: '1px solid var(--border)',
                            opacity: canCancel ? 1 : 0.6,
                            cursor: canCancel ? 'pointer' : 'not-allowed'
                          }}
                        >
                          <X size={16} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StuSession;