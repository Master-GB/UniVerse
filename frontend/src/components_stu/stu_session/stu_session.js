import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, User, Video, AlertCircle, X } from 'lucide-react';
import './stu_session.css';
import axios from 'axios';
const API_BASE = 'http://localhost:8070';

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
        const { data } = await axios.get('http://localhost:8070/mentorshipResponse/display');
        const now = new Date();

        // Normalize backend to UI shape
        const normalized = (Array.isArray(data) ? data : []).map(s => {
          const startDate = s.session_start_date ? new Date(s.session_start_date) : null;
          const dateStr = startDate ? startDate.toISOString().split('T')[0] : '';
          return {
            id: s._id,
            title: s.session_title,
            mentor: s.mentor_name,
            date: dateStr,
            time: s.session_start_time,
            duration: s.session_duration,
            seats: Number(s.seat_count ?? 0),
            status: s.session_status, // 'book' | 'booked'
            email: s.mentor_email,
            link: s.session_link,
            resources: Array.isArray(s.session_resources) ? s.session_resources : []
          };
        });

        // Keep only future sessions
        const future = normalized.filter(session => 
          session.date && session.time && new Date(`${session.date}T${session.time}`) > now
        );

        setSessions({
          available: future.filter(x => x.status !== 'booked'),
          booked: future.filter(x => x.status === 'booked')
        });
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Debug: Log sessions state changes
  useEffect(() => {
    console.log('Sessions state updated:', {
      available: sessions.available.map(s => ({ id: s.id, title: s.title, status: s.status, seats: s.seats })),
      booked: sessions.booked.map(s => ({ id: s.id, title: s.title, status: s.status, seats: s.seats }))
    });
  }, [sessions]);

  // Force download of a session resource (image, pdf, etc.) via Blob
  const handleResourceDownload = async (res) => {
    try {
      const downloadName = res?.originalName || res?.originalname || res?.name || res?.filename || 'resource';
      // Build candidate URLs to the static file
      let p = (res?.path || '').toString();
      const candidates = [];
      if (p) {
        p = p.replace(/\\/g, '/').trim();
        if (/^https?:\/\//i.test(p)) {
          candidates.push(p);
        } else {
          const idx = p.toLowerCase().lastIndexOf('/uploads/');
          if (idx !== -1) {
            const rel = p.slice(idx + 1);
            candidates.push(`${API_BASE}/${rel.replace(/^\/+/, '')}`);
          } else {
            const rel = p.startsWith('uploads/') ? p : `uploads/${p.replace(/^\/+/, '')}`;
            candidates.push(`${API_BASE}/${rel}`);
          }
        }
      } else if (res?.filename) {
        candidates.push(`${API_BASE}/uploads/${res.filename}`);
        candidates.push(`${API_BASE}/uploads/session-resources/${res.filename}`);
      } else {
        console.error('Resource has neither path nor filename. Cannot construct URL.', res);
        return;
      }

      console.log('Downloading resource. Candidates:', candidates, 'resource:', res);

      let response = null;
      let usedUrl = '';
      for (const candidate of candidates) {
        try {
          response = await axios.get(candidate, { responseType: 'blob' });
          usedUrl = candidate;
          break;
        } catch (e) {
          // try next candidate
          continue;
        }
      }
      if (!response) {
        throw new Error('All candidate URLs failed');
      }
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download resource via blob, trying direct link fallback:', err);
      try {
        const downloadName = res?.originalName || res?.originalname || res?.name || res?.filename || 'resource';
        // Build fallback direct-link candidates
        let p = (res?.path || '').toString();
        const candidates = [];
        if (p) {
          p = p.replace(/\\/g, '/').trim();
          if (/^https?:\/\//i.test(p)) {
            candidates.push(p);
          } else {
            const idx = p.toLowerCase().lastIndexOf('/uploads/');
            if (idx !== -1) {
              const rel = p.slice(idx + 1);
              candidates.push(`${API_BASE}/${rel.replace(/^\/+/, '')}`);
            } else {
              const rel = p.startsWith('uploads/') ? p : `uploads/${p.replace(/^\/+/, '')}`;
              candidates.push(`${API_BASE}/${rel}`);
            }
          }
        } else if (res?.filename) {
          candidates.push(`${API_BASE}/uploads/${res.filename}`);
          candidates.push(`${API_BASE}/uploads/session-resources/${res.filename}`);
        } else {
          console.error('Resource has neither path nor filename for fallback.', res);
          return;
        }
        // Create a direct link with download attribute as fallback
        const a = document.createElement('a');
        a.href = candidates[0];
        a.download = downloadName;
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (fallbackErr) {
        console.error('Direct link fallback also failed:', fallbackErr);
      }
    }
  };

  const handleBook = async (sessionId) => {
    const session = sessions.available.find(s => s.id === sessionId);
    if (!session || session.seats <= 0 || sessions.booked.some(s => s.id === sessionId)) {
      console.log('Cannot book: Invalid session or already booked');
      return;
    }

    console.log('Starting book process for session:', sessionId);

    // Optimistic UI update
    const optimistic = {
      available: sessions.available.filter(s => s.id !== sessionId),
      booked: [...sessions.booked, { ...session, status: 'booked' }]
    };
    setSessions(optimistic);

    try {
      console.log('Fetching full session data for:', sessionId);
      const { data: full } = await axios.get(`http://localhost:8070/mentorshipResponse/getid/${sessionId}`);
      
      if (!full) {
        throw new Error('Failed to fetch session data');
      }

      const payload = {
        session_status: 'booked',
        seat_count: Math.max(0, Number(full.seat_count || 1) - 1)
      };

      console.log('Sending update with payload:', payload);
      
      const response = await axios.put(
        `http://localhost:8070/mentorshipResponse/update/${sessionId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Update response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        request: {
          method: response.config.method,
          url: response.config.url,
          data: response.config.data
        }
      });

      // Re-fetch all sessions to ensure UI is in sync with backend
      console.log('Fetching updated sessions...');
      const { data: updatedSessions } = await axios.get('http://localhost:8070/mentorshipResponse/display');
      console.log('Raw updated sessions:', JSON.stringify(updatedSessions, null, 2));
      
      const now = new Date();
      const normalized = (Array.isArray(updatedSessions) ? updatedSessions : []).map(s => {
        const session = {
          id: s._id || s.id,  // Try both _id and id
          title: s.session_title || 'Untitled Session',
          mentor: s.mentor_name || 'Unknown Mentor',
          date: s.session_start_date ? new Date(s.session_start_date).toISOString().split('T')[0] : '',
          time: s.session_start_time || '',
          duration: s.session_duration || 0,
          seats: Number(s.seat_count ?? 0),
          status: s.session_status || 'unknown',
          email: s.mentor_email || '',
          link: s.session_link || '#',
          resources: Array.isArray(s.session_resources) ? s.session_resources : []
        };
        console.log('Normalized session:', session);
        return session;
      });

      const future = normalized.filter(s => {
        if (!s.date || !s.time) return false;
        const sessionDate = new Date(`${s.date}T${s.time}`);
        return sessionDate > now;
      });

      const newAvailable = future.filter(x => x.status !== 'booked');
      const newBooked = future.filter(x => x.status === 'booked');
      
      console.log('Updating sessions state with:', {
        availableCount: newAvailable.length,
        bookedCount: newBooked.length,
        allSessions: future.map(s => ({
          id: s.id,
          title: s.title,
          status: s.status,
          seats: s.seats
        }))
      });
      
      setSessions({
        available: newAvailable,
        booked: newBooked
      });

      console.log('Booking completed successfully');
    } catch (e) {
      console.error('Booking failed, reverting:', e);
      // Revert on failure
      setSessions(prev => ({
        available: [...prev.available, { ...session }],
        booked: prev.booked.filter(s => s.id !== sessionId)
      }));
    }
  };

  const handleCancel = async (sessionId) => {
    const session = sessions.booked.find(s => s.id === sessionId);
    if (!session) {
      console.log('Cannot cancel: Session not found in booked list');
      return;
    }

    console.log('Starting cancel process for session:', sessionId);

    // Optimistic UI update
    const existingAvailable = sessions.available.find(s => s.id === sessionId);
    const optimisticAvailable = existingAvailable
      ? sessions.available.map(s => s.id === sessionId ? { ...s, seats: (s.seats || 0) + 1, status: 'book' } : s)
      : [...sessions.available, { ...session, seats: 1, status: 'book' }];

    const optimistic = {
      available: optimisticAvailable,
      booked: sessions.booked.filter(s => s.id !== sessionId)
    };
    setSessions(optimistic);

    try {
      console.log('Fetching full session data for:', sessionId);
      const { data: full } = await axios.get(`http://localhost:8070/mentorshipResponse/getid/${sessionId}`);
      
      if (!full) {
        throw new Error('Failed to fetch session data');
      }

      const payload = {
        session_status: 'book',
        seat_count: Number(full.seat_count || 0) + 1
      };

      console.log('Sending cancel update with payload:', payload);
      
      const response = await axios.put(
        `http://localhost:8070/mentorshipResponse/update/${sessionId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Cancel update response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        request: {
          method: response.config.method,
          url: response.config.url,
          data: response.config.data
        }
      });

      // Re-fetch all sessions to ensure UI is in sync with backend
      console.log('Fetching updated sessions...');
      const { data: updatedSessions } = await axios.get('http://localhost:8070/mentorshipResponse/display');
      console.log('Raw updated sessions:', JSON.stringify(updatedSessions, null, 2));
      
      const now = new Date();
      const normalized = (Array.isArray(updatedSessions) ? updatedSessions : []).map(s => {
        const session = {
          id: s._id || s.id,  // Try both _id and id
          title: s.session_title || 'Untitled Session',
          mentor: s.mentor_name || 'Unknown Mentor',
          date: s.session_start_date ? new Date(s.session_start_date).toISOString().split('T')[0] : '',
          time: s.session_start_time || '',
          duration: s.session_duration || 0,
          seats: Number(s.seat_count ?? 0),
          status: s.session_status || 'unknown',
          email: s.mentor_email || '',
          link: s.session_link || '#',
          resources: Array.isArray(s.session_resources) ? s.session_resources : []
        };
        console.log('Normalized session:', session);
        return session;
      });

      const future = normalized.filter(s => {
        if (!s.date || !s.time) return false;
        const sessionDate = new Date(`${s.date}T${s.time}`);
        return sessionDate > now;
      });

      const newAvailable = future.filter(x => x.status !== 'booked');
      const newBooked = future.filter(x => x.status === 'booked');
      
      console.log('Updating sessions state with:', {
        availableCount: newAvailable.length,
        bookedCount: newBooked.length,
        allSessions: future.map(s => ({
          id: s.id,
          title: s.title,
          status: s.status,
          seats: s.seats
        }))
      });
      
      setSessions({
        available: newAvailable,
        booked: newBooked
      });

      console.log('Cancellation completed successfully');
    } catch (e) {
      console.error('Cancel failed, reverting:', e);
      // Re-fetch to ensure consistency
      try {
        const { data } = await axios.get('http://localhost:8070/mentorshipResponse/display');
        const now = new Date();
        const normalized = (Array.isArray(data) ? data : []).map(s => {
          const startDate = s.session_start_date ? new Date(s.session_start_date) : null;
          const dateStr = startDate ? startDate.toISOString().split('T')[0] : '';
          return {
            id: s._id,
            title: s.session_title,
            mentor: s.mentor_name,
            date: dateStr,
            time: s.session_start_time,
            duration: s.session_duration,
            seats: Number(s.seat_count ?? 0),
            status: s.session_status,
            email: s.mentor_email,
            link: s.session_link,
            resources: Array.isArray(s.session_resources) ? s.session_resources : []
          };
        });
        const future = normalized.filter(session => session.date && session.time && new Date(`${session.date}T${session.time}`) > now);
        setSessions({
          available: future.filter(x => x.status !== 'booked'),
          booked: future.filter(x => x.status === 'booked')
        });
      } catch (reloadErr) {
        console.error('Failed to reload sessions:', reloadErr);
      }
    }
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
                      <div><User size={14} /> {session.mentor} {session.email && (<>
                        • <a href={`mailto:${session.email}`}>{session.email}</a>
                      </>)}</div>
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
                      {Array.isArray(session.resources) && session.resources.length > 0 && (
                        <div>
                          Resources: {session.resources.map((res, idx) => {
                            const label = res.originalName || res.name || `Resource ${idx + 1}`;
                            return (
                              <span key={idx}>
                                <a
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); handleResourceDownload(res); }}
                                  rel="noopener noreferrer"
                                >
                                  {label}
                                </a>
                                {idx < session.resources.length - 1 ? ', ' : ''}
                              </span>
                            );
                          })}
                        </div>
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
                          onClick={() => session.link && window.open(session.link, '_blank', 'noopener,noreferrer')}
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