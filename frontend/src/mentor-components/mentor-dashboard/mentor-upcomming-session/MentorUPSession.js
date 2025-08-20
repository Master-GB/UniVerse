import React, { useEffect, useState } from 'react';
import { Clock, Video, MessageSquare, AlertCircle } from 'lucide-react';

const MentorUPSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching sessions from API...");
        
        const response = await fetch("http://localhost:8070/mentorshipResponse/display");
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📋 Raw API Response:", data);

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("❌ Expected array but got:", typeof data, data);
          throw new Error("Invalid data format received from server");
        }

        // Filter upcoming sessions
        const now = new Date();
        console.log("📅 Current date:", now);

        const upcoming = data.filter(session => {
          if (!session.session_start_date) {
            console.warn("⚠️ Session missing start date:", session);
            return false;
          }

          const sessionDate = new Date(session.session_start_date);
          console.log(`📅 Comparing: ${sessionDate} > ${now} = ${sessionDate > now}`);
          
          return sessionDate > now;
        });

        // Sort by session_start_date (earliest first) and take only first 3
        const sortedUpcoming = upcoming
          .sort((a, b) => new Date(a.session_start_date) - new Date(b.session_start_date))
          .slice(0, 3);

        console.log(`✅ Found ${upcoming.length} upcoming sessions, showing first 3:`, sortedUpcoming);
        setSessions(sortedUpcoming);

      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="panel-md sessions-panel-md">
        <div className="panel-header-md">
          <h3 className="panel-title-md">
            <Clock size={20} />
            Upcoming Sessions
          </h3>
        </div>
        <div className="sessions-list-md">
          <p className="loading-message">⏳ Loading sessions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="panel-md sessions-panel-md">
        <div className="panel-header-md">
          <h3 className="panel-title-md">
            <AlertCircle size={20} />
            Upcoming Sessions
          </h3>
        </div>
        <div className="sessions-list-md">
          <p className="error-message" style={{ color: '#ef4444' }}>
            ❌ Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="panel-md sessions-panel-md">
        <div className="panel-header-md">
          <h3 className="panel-title-md">
            <Clock size={20} />
            Upcoming Sessions
          </h3>
          <span className="panel-badge-md">{sessions.length}</span>
        </div>

        <div className="sessions-list-md">
          {sessions.length > 0 ? (
            <>
              {sessions.map((session, index) => (
                <div key={session._id || session.id || index} className="session-item-md">
                  <div className="session-info-md">
                    <h4 className="session-student-md">
                      {session.mentor_name || 'Unknown Mentor'}
                    </h4>
                    <p className="session-subject-md">
                      {session.session_title || 'No Title'}
                    </p>
                    {session.session_description && (
                      <p className="session-description" style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                        {session.session_description}
                      </p>
                    )}
                  </div>
                  <div className="session-meta-md">
                    <span className="session-time-md">
                      {session.session_start_date ? (
                        <>
                          {new Date(session.session_start_date).toLocaleDateString()}
                          {session.session_start_time && (
                            <> at {session.session_start_time}</>
                          )}
                        </>
                      ) : (
                        'No Date Set'
                      )}
                    </span>
                    <div className="session-type-md type-video-md">
                      <Video size={16} />
                    </div>
                    {session.session_link && (
                      <a 
                        href={session.session_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="session-link-btn"
                        style={{
                          marginLeft: '8px',
                          padding: '4px 8px',
                          background: '#3b82f6',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}
                      >
                        Start Session
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {/* Show indicator if there are more sessions */}
              {sessions.length === 3 && (
                <p style={{ 
                  textAlign: 'center', 
                  color: '#666', 
                  fontSize: '0.875rem', 
                  fontStyle: 'italic',
                  marginTop: '12px' 
                }}>
                  📋 Showing next 3 upcoming sessions
                </p>
              )}
            </>
          ) : (
            <p className="no-sessions-md">📅 No upcoming sessions scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorUPSession;