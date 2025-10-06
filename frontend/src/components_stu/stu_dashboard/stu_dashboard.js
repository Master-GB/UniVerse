import React, { useState, useEffect } from 'react';
import MatrixEffect from './MatrixEffect';
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  FileText, 
  Award, 
  Briefcase, 
  GraduationCap,
  Calendar,
  TrendingUp,
  Play,
  Download,
  Clock,
  ChevronRight,
  Target,
  PlusCircle,
  BarChart3,
  Activity,
  Zap,
  Star,
  ArrowUpRight,
  Timer,
  BookMarked,
  Megaphone,
  Video,
} from 'lucide-react';
import "./stu_dashboard.css";


const StuDashboard = () => {
  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState('all');
  const [now, setNow] = useState(new Date());
  const [resources, setResources] = useState([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [resourcesError, setResourcesError] = useState(null);
  const [bookedSessions, setBookedSessions] = useState(() => {
    return JSON.parse(localStorage.getItem('bookedSessions')) || [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tech News state
  const [techNews, setTechNews] = useState([
    {
      id: 1,
      title: 'New AI Breakthrough in Natural Language Processing',
      source: 'TechCrunch',
      date: '2 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1677442135136-760c81327412?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBicmVha3Rocm91Z2h8ZW58MHx8MHx8fDA%3D'
    },
    {
      id: 2,
      title: 'The Future of Web Development: What to Expect in 2024',
      source: 'Dev.to',
      date: '5 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D'
    },
    {
      id: 3,
      title: 'How Quantum Computing is Changing Cybersecurity',
      source: 'Wired',
      date: '1 day ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVhbnR1bSUyMGNvbXB1dGluZ3xlbnwwfHwwfHx8MA%3D%3D'
    }
  ]);
  
  // In a real app, you would fetch from a news API
// Tech News state


// Fixed useEffect for fetching tech news/articles
useEffect(() => {
  const fetchTechNews = async () => {
    try {
      console.log('Fetching articles from API...');
      const response = await fetch("http://localhost:8070/mentor-article/display");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Raw API response:", data);

      // Handle the response structure - the API returns { message, articles }
      const articles = data.articles || [];
      
      if (!Array.isArray(articles)) {
        console.warn('Articles is not an array:', articles);
        setTechNews([]);
        return;
      }

      console.log("Processing articles:", articles.length);

      const formatted = articles.map((article) => {
        // Handle image data properly
        let imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
        
        if (article.article_image && article.article_image.data) {
          try {
            // Convert Buffer to base64 if it's a Buffer object
            const imageBuffer = article.article_image.data;
            let base64String;
            
            if (imageBuffer.type === 'Buffer' && Array.isArray(imageBuffer.data)) {
              // Handle Buffer object with data array
              base64String = Buffer.from(imageBuffer.data).toString('base64');
            } else if (typeof imageBuffer === 'string') {
              // Handle if it's already a base64 string
              base64String = imageBuffer;
            } else {
              // Handle direct buffer
              base64String = Buffer.from(imageBuffer).toString('base64');
            }
            
            imageUrl = `data:${article.article_image.contentType || 'image/jpeg'};base64,${base64String}`;
          } catch (error) {
            console.error('Error processing image for article:', article._id, error);
            // Keep default placeholder image
          }
        }

        // Format date properly
        let formattedDate = "Unknown date";
        if (article.createdAt) {
          try {
            const date = new Date(article.createdAt);
            const now = new Date();
            const diffMs = now - date;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffHours < 1) {
              formattedDate = "Just now";
            } else if (diffHours < 24) {
              formattedDate = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
              formattedDate = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else {
              formattedDate = date.toLocaleDateString();
            }
          } catch (error) {
            console.error('Error formatting date:', error);
            formattedDate = new Date(article.createdAt).toLocaleDateString();
          }
        }

        return {
          id: article._id,
          title: article.article_title || "Untitled Article",
          source: article.article_author || "Unknown Author",
          date: formattedDate,
          category: article.article_category || "Tech News",
          duration: article.artivle_duration || "5 min read", // Note: there's a typo in your schema
          url: `/student/articales/${article._id}`, // Fixed typo in "articles"
          image: imageUrl,
          description: article.article_description ? 
            article.article_description.substring(0, 100) + "..." : 
            "No description available"
        };
      });

      console.log("Formatted articles:", formatted);
      
      // Sort by creation date (newest first) and take only the latest 5
      const sortedArticles = formatted
        .sort((a, b) => {
          // If we have creation dates, sort by them
          if (articles.find(art => art._id === a.id)?.createdAt && 
              articles.find(art => art._id === b.id)?.createdAt) {
            return new Date(articles.find(art => art._id === b.id).createdAt) - 
                   new Date(articles.find(art => art._id === a.id).createdAt);
          }
          return 0;
        })
        .slice(0, 5);

      setTechNews(sortedArticles);
      
    } catch (error) {
      console.error("Error fetching tech news:", error);
      // Set empty array on error to avoid breaking the UI
      setTechNews([]);
    }
  };

  fetchTechNews();
}, []);


  // Fetch resources from API



useEffect(() => {
  const fetchTechNews = async () => {
    try {
      console.log('Fetching articles from API...');
      const response = await fetch("http://localhost:8070/mentor-article/display");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Raw API response:", data);

      // Handle the response structure - the API returns { message, articles }
      const articles = data.articles || [];
      
      if (!Array.isArray(articles)) {
        console.warn('Articles is not an array:', articles);
        setTechNews([]);
        return;
      }

      console.log("Processing articles:", articles.length);

      const formatted = articles.map((article) => {
        // Handle image data properly
        let imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
        
        if (article.article_image && article.article_image.data) {
          try {
            // Convert Buffer to base64 if it's a Buffer object
            const imageBuffer = article.article_image.data;
            let base64String;
            
            if (imageBuffer.type === 'Buffer' && Array.isArray(imageBuffer.data)) {
              // Handle Buffer object with data array
              base64String = Buffer.from(imageBuffer.data).toString('base64');
            } else if (typeof imageBuffer === 'string') {
              // Handle if it's already a base64 string
              base64String = imageBuffer;
            } else {
              // Handle direct buffer
              base64String = Buffer.from(imageBuffer).toString('base64');
            }
            
            imageUrl = `data:${article.article_image.contentType || 'image/jpeg'};base64,${base64String}`;
          } catch (error) {
            console.error('Error processing image for article:', article._id, error);
            // Keep default placeholder image
          }
        }

        // Format date properly
        let formattedDate = "Unknown date";
        if (article.createdAt) {
          try {
            const date = new Date(article.createdAt);
            const now = new Date();
            const diffMs = now - date;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffHours < 1) {
              formattedDate = "Just now";
            } else if (diffHours < 24) {
              formattedDate = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
              formattedDate = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else {
              formattedDate = date.toLocaleDateString();
            }
          } catch (error) {
            console.error('Error formatting date:', error);
            formattedDate = new Date(article.createdAt).toLocaleDateString();
          }
        }

        return {
          id: article._id,
          title: article.article_title || "Untitled Article",
          source: article.article_author || "Unknown Author",
          date: formattedDate,
          category: article.article_category || "Tech News",
          duration: article.artivle_duration || "5 min read", // Note: there's a typo in your schema
          url: `/student/articales/${article._id}`, // Fixed typo in "articles"
          image: imageUrl,
          description: article.article_description ? 
            article.article_description.substring(0, 100) + "..." : 
            "No description available"
        };
      });

      console.log("Formatted articles:", formatted);
      
      // Sort by creation date (newest first) and take only the latest 3
      const sortedArticles = formatted
        .sort((a, b) => {
          // If we have creation dates, sort by them
          if (articles.find(art => art._id === a.id)?.createdAt && 
              articles.find(art => art._id === b.id)?.createdAt) {
            return new Date(articles.find(art => art._id === b.id).createdAt) - 
                   new Date(articles.find(art => art._id === a.id).createdAt);
          }
          return 0;
        })
        .slice(0, 3);

      setTechNews(sortedArticles);
      
    } catch (error) {
      console.error("Error fetching tech news:", error);
      // Set empty array on error to avoid breaking the UI
      setTechNews([]);
    }
  };

  fetchTechNews();
}, []);

  const [sessions, setSessions] = useState(() => {
    console.log('Initial sessions state set');
    return [];
  });
  const [bookedSessionsCount, setBookedSessionsCount] = useState(0);
  
  // Effect to track and count future booked sessions
  useEffect(() => {
    console.log('Sessions updated. Count:', sessions.length);
    const now = new Date();
    
    // Filter only 'booked' status sessions
    const bookedSessions = sessions.filter(session => {
      // Check if session status is exactly 'booked' (case insensitive)
      const status = String(session.status || session.session_status || '').toLowerCase().trim();
      const isBooked = status === 'booked';
      
      if (!isBooked) {
        console.log('Skipping session - not "booked":', {
          id: session.id,
          title: session.title,
          status: status
        });
        return false;
      }
      
      // Check if session is in the future
      try {
        let sessionDate;
        
        // Try to parse date from different possible fields
        if (session.session_datetime) {
          sessionDate = new Date(session.session_datetime);
        } else if (session.session_start_date && session.session_start_time) {
          sessionDate = new Date(`${session.session_start_date}T${session.session_start_time}`);
        } else if (session.date && session.time) {
          sessionDate = new Date(`${session.date}T${session.time}`);
        }
        
        // If we couldn't parse a valid date, exclude the session
        if (!sessionDate || isNaN(sessionDate.getTime())) {
          console.log('Invalid date for session:', {
            id: session.id,
            title: session.title,
            date: session.session_datetime || `${session.session_start_date} ${session.session_start_time}`
          });
          return false;
        }
        
        // Check if session is in the future
        const isFuture = sessionDate > now;
        
        if (isFuture) {
          console.log('✅ Future booked session:', {
            id: session.id,
            title: session.title,
            status: status,
            sessionDate: sessionDate.toString()
          });
        } else {
          console.log('⏰ Past booked session (not counted):', {
            id: session.id,
            title: session.title,
            status: status,
            sessionDate: sessionDate.toString()
          });
        }
        
        return isFuture;
        
      } catch (e) {
        console.error('Error processing session date:', e);
        return false;
      }
      
    });
    
    console.log('All sessions:', sessions);
    console.log('Booked sessions:', bookedSessions);
    console.log('📋 Total booked sessions:', bookedSessions.length);
    
    // Update the UI with the count of booked sessions
    if (bookedSessions.length !== bookedSessionsCount) {
      console.log('🔄 Updating booked sessions count to:', bookedSessions.length);
      setBookedSessionsCount(bookedSessions.length);
    }
  }, [sessions]);

  // Fetch all mentorship sessions from the database
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log('Starting to fetch sessions...');
        // Fetch all sessions
        const resp = await fetch('http://localhost:8070/mentorshipResponse/display');
        const responseData = await resp.text(); // Get raw response text first
        console.log('Raw response:', responseData);
        
        let data;
        try {
          data = JSON.parse(responseData);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          throw new Error('Invalid JSON response from server');
        }
        
        if (!resp.ok) throw new Error(data?.message || 'Failed to load sessions');

        console.log('Parsed response data:', data);
        
        // Log the raw response type and structure
        console.log('Response type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        console.log('Response keys (if object):', typeof data === 'object' ? Object.keys(data) : 'N/A');
        
        if (!Array.isArray(data) && data.data) {
          console.log('Data contains data property, type:', typeof data.data);
          console.log('Is data.data array?', Array.isArray(data.data));
          console.log('data.data keys (if object):', typeof data.data === 'object' ? Object.keys(data.data) : 'N/A');
        }
        
        // Handle both array response and object with data array
        const raw = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        
        // Log first session to check its structure
        if (raw.length > 0) {
          console.log('Raw session data from API (first session):', JSON.stringify(raw[0], null, 2));
          console.log('First session keys:', Object.keys(raw[0]));
          console.log('First session status:', raw[0].session_status);
          console.log('First session status (alternative):', raw[0]?.status);
        }
        raw.forEach((session, index) => {
          console.log(`Session ${index + 1} details:`, {
            id: session._id,
            title: session.session_title || session.title,
            status: session.session_status || session.status,
            startDate: session.session_start_date || session.date,
            startTime: session.session_start_time || session.time,
            allKeys: Object.keys(session)
          });
        });
        
        // Debug log full session objects
        // Log the first session's complete data for debugging
        if (raw.length > 0) {
          console.log('First session data:', JSON.parse(JSON.stringify(raw[0], null, 2)));
        }
        
        // Log all session statuses
        const statusCounts = raw.reduce((acc, session) => {
          const status = session.session_status || 'no_status';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        console.log('Session status counts:', statusCounts);
        
        // Just set the sessions, the effect will handle the counting
        console.log('Setting sessions data');

        const normalized = raw.map((s) => {
          // Accept multiple possible field names from API
          const dateField = s.session_start_date || s.session_date || s.date || '';
          const timeField = s.session_start_time || s.start_time || s.time || '';
          const isoField = s.session_datetime || s.startAt || '';

          let sessionDate = null;
          let formattedDate = 'Date not set';
          let formattedTime = 'Time not set';

          // Case A: combined ISO datetime provided
          if (isoField && typeof isoField === 'string') {
            const d = new Date(isoField);
            if (!isNaN(d.getTime())) {
              sessionDate = d;
            }
          }

          // Case B: separate date and time
          if (!sessionDate && typeof dateField === 'string' && dateField.length > 0) {
            // If date contains 'T', treat as ISO string
            if (dateField.includes('T')) {
              const d = new Date(dateField);
              if (!isNaN(d.getTime())) sessionDate = d;
            } else {
              // Expecting YYYY-MM-DD
              const parts = dateField.split('-').map(Number);
              if (parts.length === 3) {
                const [year, month, day] = parts;
                const d = new Date(year, (month || 1) - 1, day || 1);
                if (!isNaN(d.getTime())) sessionDate = d;
              }
            }

            // Apply time if provided (supports HH:MM, HH:MM:SS, and 12h with AM/PM)
            if (sessionDate && typeof timeField === 'string' && timeField.length > 0) {
              const tf = timeField.trim();
              const ampmMatch = tf.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([AaPp][Mm])$/);
              if (ampmMatch) {
                let hh = parseInt(ampmMatch[1], 10);
                const mm = parseInt(ampmMatch[2] || '0', 10);
                const ss = parseInt(ampmMatch[3] || '0', 10);
                const ap = ampmMatch[4].toLowerCase();
                if (ap === 'pm' && hh < 12) hh += 12;
                if (ap === 'am' && hh === 12) hh = 0;
                sessionDate.setHours(hh, isNaN(mm) ? 0 : mm, isNaN(ss) ? 0 : ss, 0);
              } else {
                const tparts = tf.split(':').map((p) => parseInt(p, 10));
                const [hh = 0, mm = 0, ss = 0] = tparts;
                if (!isNaN(hh) && !isNaN(mm)) {
                  sessionDate.setHours(hh, mm, isNaN(ss) ? 0 : ss, 0);
                }
              }
            }
          }

          if (sessionDate && !isNaN(sessionDate.getTime())) {
            formattedDate = sessionDate.toLocaleDateString();
            formattedTime = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          }

          return {
            id: s?._id || s?.id,
            title: s?.session_title || s?.title || 'Untitled Session',
            mentor: s?.mentor_name || s?.mentor || 'Unknown',
            date: formattedDate,
            time: formattedTime,
            session_status: s?.session_status || s?.status, // Make sure status is included
            session_start_date: s?.session_start_date || s?.date, // Include raw date for filtering
            session_start_time: s?.session_start_time || s?.time, // Include raw time for filtering
            session_datetime: sessionDate,
            session_duration: s?.session_duration || s?.duration || '',
            startTime: sessionDate ? sessionDate.getTime() : null,
            seats: Number(s?.seat_count ?? s?.seats ?? s?.available_seats ?? 0),
            status: s?.session_status || s?.status || 'book',
            location: s?.location || 'Online',
            session_link: s?.session_link || s?.meeting_url || s?.link || ''
          };
        });

        // Keep only UPCOMING sessions with a valid start time and sort by soonest
        console.log('Normalized sessions:', JSON.stringify(normalized, null, 2)); // Debug log

        const upcoming = normalized
          .filter(n => typeof n.startTime === 'number' && n.startTime > now.getTime())
          .sort((a, b) => a.startTime - b.startTime);

        console.log('Upcoming sessions (sorted):', JSON.stringify(upcoming, null, 2)); // Debug log

        // Get all sessions and sort them by start time
        const allSessions = normalized
          .filter(n => typeof n.startTime === 'number')
          .sort((a, b) => a.startTime - b.startTime);
        
        console.log('Total sessions found:', allSessions.length);
        
        // Store all sessions in state for other components to use
        setSessions(allSessions);
        
        // For the Academic Support section, we'll show only the top 5 upcoming sessions
        const top5 = allSessions.slice(0, 5);
        console.log('Displaying top 5 sessions in UI:', top5.length);
      } catch (e) {
        console.error('Failed to load mentorship sessions for dashboard:', e);
        setSessions([]);
      }
    };

    fetchSessions();
  }, []);

  // Normalize session data from the API
  const normalizeSession = (session) => {
    const startTime = session.session_start_time ? new Date(session.session_start_time) : null;
    const endTime = session.session_end_time ? new Date(session.session_end_time) : null;
    
    return {
      id: session._id || session.id,
      title: session.title || 'Untitled Session',
      mentor: session.mentor_name || session.mentor || 'Mentor not specified',
      date: startTime ? startTime.toLocaleDateString() : 'Date not set',
      session_start_time: startTime,
      session_end_time: endTime,
      session_duration: session.duration || 60, // Default to 60 minutes if not specified
      seats: session.available_seats || 0,
      status: session.status || 'book',
      description: session.description || '',
      location: session.location || 'Online',
      ...session // Spread the rest of the properties
    };
  };

  // Allow joining only within 1 hour before the session start time
  const canJoinNow = (s) => {
    try {
      const start = s?.session_start_time
        ? new Date(s.session_start_time)
        : (typeof s?.startTime === 'number' ? new Date(s.startTime) : null);
      if (!start || isNaN(start.getTime())) return false;
      const oneHourBefore = new Date(start);
      oneHourBefore.setHours(oneHourBefore.getHours() - 1);
      return now >= oneHourBefore && now <= start;
    } catch (_) {
      return false;
    }
  };

  // Book a mentorship session (optimistic update + backend sync)
  const handleBook = async (sessionId) => {
    const target = sessions.find(s => s.id === sessionId);
    if (!target) return;
    if (target.status === 'booked' || (target.seats ?? 0) <= 0) return;

    // Save current state for potential rollback
    const prevSessions = [...sessions];
    
    // 1. First update the UI optimistically
    setSessions(prev => 
      prev.map(s => 
        s.id === sessionId 
          ? { 
              ...s, 
              status: 'booked', 
              session_status: 'booked',
              seats: Math.max(0, (s.seats || 0) - 1),
              bookedAt: new Date().toISOString(),
              // Ensure we keep the original date/time fields
              session_start_date: s.session_start_date,
              session_start_time: s.session_start_time,
              session_datetime: s.session_datetime,
              date: s.date,
              time: s.time
            } 
          : s
      )
    );
    
    try {
      // 2. Update the backend
      const resp = await fetch(`http://localhost:8070/mentorshipResponse/update/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          session_status: 'booked',
          seat_count: Math.max(0, (target.seats || 0) - 1)
        })
      });
      
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      
      // 3. Refresh the sessions list after a short delay
      setTimeout(async () => {
        try {
          const updatedResp = await fetch('http://localhost:8070/mentorshipResponse/display');
          const responseData = await updatedResp.json();
          const updatedSessions = Array.isArray(responseData) 
            ? responseData 
            : (responseData?.data || []);
          
          if (updatedSessions.length > 0) {
            // Only update if we have valid session data
            const normalizedSessions = updatedSessions.map(session => ({
              ...session,
              id: session._id || session.id,
              title: session.session_title || session.title,
              status: session.session_status || session.status,
              seats: session.seat_count || session.seats,
              session_start_date: session.session_start_date || session.date,
              session_start_time: session.session_start_time || session.time,
              session_datetime: session.session_datetime || 
                (session.session_start_date && session.session_start_time 
                  ? `${session.session_start_date}T${session.session_start_time}` 
                  : null)
            }));
            
            // Only update if we have valid sessions
            if (normalizedSessions.length > 0) {
              setSessions(currentSessions => {
                // Create a map of existing sessions for reference
                const sessionMap = new Map(currentSessions.map(s => [s.id, s]));
                
                // Merge updated sessions while preserving any local state
                return normalizedSessions.map(updated => ({
                  ...updated,
                  // Preserve local state if it exists
                  ...(sessionMap.get(updated.id) || {})
                }));
              });
            }
          }
        } catch (e) {
          console.error('Failed to refresh sessions:', e);
          // Don't revert on refresh failure, keep the optimistic update
        }
      }, 1000);
    } catch (e) {
      console.error('Booking failed, reverting:', e);
      // Revert to previous state on error
      setSessions(prevSessions);
    }
};

  const quizzes = [
    { id: 1, title: "Algorithms Warm-up", questions: 10, est: 8, level: "Beginner" },
    { id: 2, title: "DBMS Mastery", questions: 15, est: 12, level: "Intermediate" },
    { id: 3, title: "Networking Quick Check", questions: 8, est: 6, level: "Beginner" }
  ];

  const courses = [
    { id: 1, title: "Full-Stack Foundations", provider: "SkillHub", progress: 62, rating: 4.8 },
    { id: 2, title: "Data Analysis with Python", provider: "DataCraft", progress: 35, rating: 4.6 },
    { id: 3, title: "Career Accelerator: Resume to Interview", provider: "ProEdge", progress: 80, rating: 4.9 }
  ];

  // Map API resource types to UI types
  const mapResourceType = (type) => {
    switch (type) {
      case 'LectureVideo':
        return 'video';
      case 'LectureNote':
        return 'notes';
      case 'PastPapper':
      case 'Papper':
        return 'paper';
      default:
        return 'other';
    }
  };

  // Format resources for display
  const formatResource = (resource) => {
    if (!resource) return null;
    
    return {
      id: resource._id || resource.id,
      title: resource.title || 'Untitled Resource',
      author: resource.uploadedBy || 'Unknown',
      time: resource.updatedAt ? new Date(resource.updatedAt).toLocaleDateString() : 'Unknown date',
      type: mapResourceType(resource.typeOfRes || resource.type || 'other'),
      fileUrl: resource.fileUrl || '#',
      typeOfRes: resource.typeOfRes || 'other' // Keep original type for filtering
    };
  };

  // Handle both direct array and object with resources property
  const resourcesArray = Array.isArray(resources) 
    ? resources 
    : (resources && Array.isArray(resources.resources) ? resources.resources : []);

  const filteredResources = resourcesArray
    .filter(r => {
      if (!r) return false;
      return resourceFilter === "all" || mapResourceType(r.typeOfRes || r.type) === resourceFilter;
    })
    .map(formatResource)
    .filter(Boolean); // Remove any null entries

  const handleBookSession = async (sessionId, bookingData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would make an API call here
      // const response = await fetch('/api/sessions/book', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ sessionId, ...bookingData })
      // });
      // const result = await response.json();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedBookedSessions = [...bookedSessions, sessionId];
      setBookedSessions(updatedBookedSessions);
      localStorage.setItem('bookedSessions', JSON.stringify(updatedBookedSessions));
      
      // Update available seats
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId 
            ? { ...session, seats: session.seats - 1 } 
            : session
        )
      );
      
      // Show success message
      // You can use your toast notification system here
      console.log('Session booked successfully!');
      
    } catch (err) {
      console.error('Error booking session:', err);
      setError('Failed to book session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = (sessionLink, sessionId) => {
    // Open the provided session link in a new tab if available
    if (sessionLink && typeof sessionLink === 'string') {
      console.log(`Opening session link for ${sessionId}:`, sessionLink);
      window.open(sessionLink, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No session_link available for this session. Falling back to session page.');
      if (sessionId) {
        window.open(`/session/${sessionId}`, '_blank', 'noopener,noreferrer');
      }
    }
  };



  // resouce hub ///

  useEffect(() => {
  const fetchResources = async () => {
    setIsLoadingResources(true);
    setResourcesError(null);
    
    try {
      console.log('Fetching resources from API...');
      const response = await fetch("http://localhost:8070/resource/display"); // Replace with your actual resources endpoint
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Raw resources API response:", data);

      // Handle different response structures
      let resourcesArray = [];
      if (Array.isArray(data)) {
        resourcesArray = data;
      } else if (data.resources && Array.isArray(data.resources)) {
        resourcesArray = data.resources;
      } else if (data.data && Array.isArray(data.data)) {
        resourcesArray = data.data;
      }

      console.log("Processing resources:", resourcesArray.length);

      // Format resources for display
      const formattedResources = resourcesArray.map((resource) => {
        return {
          _id: resource._id || resource.id,
          id: resource._id || resource.id,
          title: resource.title || resource.resourceTitle || "Untitled Resource",
          uploadedBy: resource.uploadedBy || resource.author || resource.creator || "Unknown",
          updatedAt: resource.updatedAt || resource.createdAt || new Date().toISOString(),
          typeOfRes: resource.typeOfRes || resource.type || resource.resourceType || 'other',
          type: resource.typeOfRes || resource.type || resource.resourceType || 'other',
          fileUrl: resource.fileUrl || resource.downloadUrl || resource.url || '#',
          description: resource.description || "No description available"
        };
      });

      console.log("Formatted resources:", formattedResources);
      setResources(formattedResources);
      
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResourcesError(error.message || "Failed to load resources");
      setResources([]); // Set empty array on error
    } finally {
      setIsLoadingResources(false);
    }
  };

  fetchResources();
}, []);

  return (
    <div className="stu-dashboard">
      <MatrixEffect />
      {/* Header */}
      <div className="sd-header">
        <div className="sd-header-left">
          <div className="sd-kicker">Welcome back</div>
          <h1 className="sd-title">Your Learning & Career HQ</h1>
          <p className="sd-subtitle">Explore sessions, sharpen skills, and access curated resources in one place.</p>
        </div>
        <div className="sd-header-right">
          <div className="sd-clock">
            <Timer size={16} />
            <span>{now.toLocaleTimeString()}</span>
          </div>
          <Link to="/student/guidance" className="sd-cta">
            <PlusCircle size={18} />
            <span className='sd-cta-text'>Request Guidance</span>
         </Link>
        </div>
      </div>

      {/* Search and quick actions */}
      <div className="sd-search">
        <div className="sd-input">
          <BookOpen size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions, resources, or courses"
          />
        </div>
        <div className="sd-actions">
          <Link to="/student/session" className="sd-chip">
            <Calendar size={16} />
            <span className='sd-chip-text'>Book a Session</span>   
         </Link>
          <button className="sd-chip">
            <Award size={16} />
            Take a Quiz
          </button>
          <button className="sd-chip">
            <Briefcase size={16} />
            Career Tools
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sd-stats">
        <div className="sd-stat-card">
          <div className="sd-stat-icon a">
            <Activity size={18} />
          </div>
          <div className="sd-stat-body">
            <div className="sd-stat-value">7</div>
            <div className="sd-stat-label">Day Streak</div>
          </div>
          <TrendingUp size={16} className="sd-stat-trend up" />
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-icon b">
            <Target size={18} />
          </div>
          <div className="sd-stat-body">
            <div className="sd-stat-value">5</div>
            <div className="sd-stat-label">Skills Active</div>
          </div>
          <ChevronRight size={16} className="sd-stat-trend" />
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-icon c">
            <Users size={18} />
          </div>
          <div className="sd-stat-body">
            <div className="sd-stat-value">{bookedSessionsCount}</div>
            <div className="sd-stat-label">Sessions Booked</div>
          </div>
          <Calendar size={16} className="sd-stat-trend" />
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-icon d">
            <Star size={18} />
          </div>
          <div className="sd-stat-body">
            <div className="sd-stat-value">18</div>
            <div className="sd-stat-label">Quizzes Done</div>
          </div>
          <ArrowUpRight size={16} className="sd-stat-trend up" />
        </div>
      </div>

      {/* Main grid */}
      <div className="sd-grid">
        {/* Academic Support */}
        <section className="sd-card stretch">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <GraduationCap size={18} />
              <h2>Academic Support</h2>
            </div>
             <Link to="/student/session" className="sd-link">
                 View all
                 <ChevronRight size={16} />
             </Link>
          </header>
          <div className="sd-list">
            {sessions
              .filter(session => {
                // Check if session has a valid date
                let sessionDate;
                if (session.session_datetime) {
                  sessionDate = new Date(session.session_datetime);
                } else if (session.session_start_date && session.session_start_time) {
                  sessionDate = new Date(`${session.session_start_date}T${session.session_start_time}`);
                } else if (session.date && session.time) {
                  sessionDate = new Date(`${session.date}T${session.time}`);
                }
                
                const isUpcoming = sessionDate && !isNaN(sessionDate.getTime()) && sessionDate > new Date();
                const matchesSearch = session.title?.toLowerCase().includes(search?.toLowerCase() || '');
                
                return isUpcoming && matchesSearch;
              })
              .slice(0, 5) // Only show first 5 upcoming sessions
              .map((s) => {
                // Use the pre-formatted date and time from the normalized data
                console.log('Rendering session:', s); // Debug log
                const formattedDate = s.date || (s.session_start_time ? new Date(s.session_start_time).toLocaleDateString() : 'Date not set');
                const formattedTime = s.time || (s.session_start_time ? new Date(s.session_start_time).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                }) : 'Time not set');
                const isBooked = s.status === 'booked';
                const canJoin = isBooked ? canJoinNow(s) : false;
                
                return (
                  <div key={s.id} className="sd-list-item">
                    <div className="sd-list-left">
                      <div className="sd-avatar">
                        <Users size={16} />
                      </div>
                      <div>
                        <div className="sd-item-title">{s.title || 'Untitled Session'}</div>
                        <div className="sd-item-meta">
                          <span>{s.mentor || 'Mentor not specified'}</span>
                          <span className="sd-meta-separator">•</span>
                          <span>{formattedDate} at {formattedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sd-list-right">
                      {isBooked ? (
                        <div className="sd-badge success">Booked</div>
                      ) : (
                        <div className="sd-badge neutral">{s.seats || 0} seat{s.seats !== 1 ? 's' : ''} left</div>
                      )}
                      <button
                        className={`sd-btn ${isBooked ? 'booked' : 'primary'}`}
                        onClick={() => isBooked ? handleJoinSession(s.session_link, s.id) : handleBook(s.id)}
                        disabled={isBooked ? !canJoin : (s.seats ?? 0) <= 0}
                        title={isBooked && !canJoin ? 'Join becomes available 1 hour before session start' : ''}
                      >
                        <Calendar size={16} />
                        {isBooked ? 'Join Session' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Resources Hub */}
        <section className="sd-card">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <BookMarked size={18} />
              <h2>Resources Hub</h2>
            </div>
            <div className="sd-segment">
              {[
                { key: "all", label: "All" },
                { key: "notes", label: "Notes" },
                { key: "video", label: "Videos" },
                { key: "paper", label: "Past Papers" }
              ].map(opt => (
                <button
                  key={opt.key}
                  className={`sd-seg ${resourceFilter === opt.key ? 'active' : ''}`}
                  onClick={() => setResourceFilter(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </header>
          <div className="sd-list compact">
            {isLoadingResources ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={`loading-${index}`} className="sd-list-item">
                  <div className="sd-list-left">
                    <div className="sd-icon-pill skeleton" style={{ width: '32px', height: '32px' }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="sd-item-title skeleton" style={{ width: '70%', height: '16px', marginBottom: '4px' }}></div>
                      <div className="sd-item-meta skeleton" style={{ width: '50%', height: '14px' }}></div>
                    </div>
                  </div>
                  <div className="sd-list-right">
                    <button className="sd-btn ghost" disabled>
                      <Download size={16} />
                      Get
                    </button>
                  </div>
                </div>
              ))
            ) : resourcesError ? (
              // Error state
              <div className="sd-empty-state">
                <div className="sd-empty-icon">
                  <Megaphone size={24} />
                </div>
                <div className="sd-empty-text">
                  <p>Failed to load resources. Please try again later.</p>
                  <button 
                    className="sd-btn primary" 
                    onClick={() => window.location.reload()}
                    style={{ marginTop: '1rem' }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filteredResources.length === 0 ? (
              // Empty state
              <div className="sd-empty-state">
                <div className="sd-empty-icon">
                  <BookOpen size={24} />
                </div>
                <p>No resources found. Try a different filter.</p>
              </div>
            ) : (
              // Success state - Show 5 resources per category
              filteredResources
                .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
                .slice(0, 5) // Limit to 5 resources per category
                .map((r) => (
                  <div key={r.id} className="sd-list-item">
                    <div className="sd-list-left">
                      <div className={`sd-icon-pill ${r.type}`}>
                        {r.type === 'video' ? <Play size={14} /> : r.type === 'paper' ? <FileText size={14} /> : <BookOpen size={14} />}
                      </div>
                      <div>
                        <div className="sd-item-title">{r.title}</div>
                        <div className="sd-item-meta">{r.author} • {r.time}</div>
                      </div>
                    </div>
                    <div className="sd-list-right">
                      <a 
                        href={r.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="sd-btn ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download size={16} />
                        Get
                      </a>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Exam Preparation */}
        <section className="sd-card">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <Award size={18} />
              <h2>Exam Preparation</h2>
            </div>
            <button className="sd-link">
              Practice more
              <ChevronRight size={16} />
            </button>
          </header>
          <div className="sd-tiles">
            {quizzes
              .filter(q => q.title.toLowerCase().includes(search.toLowerCase()))
              .map((q) => (
                <div key={q.id} className="sd-tile">
                  <div className="sd-tile-top">
                    <div className="sd-badge info">{q.level}</div>
                    <Zap size={16} />
                  </div>
                  <div className="sd-tile-title">{q.title}</div>
                  <div className="sd-tile-meta">
                    <Clock size={14} /> {q.est} min • {q.questions} Qs
                  </div>
                  <button className="sd-btn primary wide">
                    <Play size={16} />
                    Start
                  </button>
                </div>
              ))}
          </div>
        </section>

        {/* Career & Skills */}
        <section className="sd-card">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <Briefcase size={18} />
              <h2>Career & Skills</h2>
            </div>
            <button className="sd-link">
              Explore tools
              <ChevronRight size={16} />
            </button>
          </header>
          <div className="sd-career">
            <div className="sd-career-item">
              <div className="sd-career-icon">
                <BarChart3 size={18} />
              </div>
              <div className="sd-career-body">
                <div className="sd-career-title">Interview Prep</div>
                <div className="sd-career-meta">Mock interviews and feedback</div>
              </div>
              <button className="sd-btn">Open</button>
            </div>
            <div className="sd-career-item">
              <div className="sd-career-icon">
                <FileText size={18} />
              </div>
              <div className="sd-career-body">
                <div className="sd-career-title">Resume Review</div>
                <div className="sd-career-meta">ATS check and polishing</div>
              </div>
              <button className="sd-btn">Open</button>
            </div>
            <div className="sd-career-item">
              <div className="sd-career-icon">
                <Users size={18} />
              </div>
              <div className="sd-career-body">
                <div className="sd-career-title">Mentor Connect</div>
                <div className="sd-career-meta">Book 1:1 guidance</div>
              </div>
              <button className="sd-btn">Open</button>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section className="sd-card stretch">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <BookOpen size={18} />
              <h2>Recommended Courses</h2>
            </div>
            <button className="sd-link">
              See all
              <ChevronRight size={16} />
            </button>
          </header>
          <div className="sd-courses">
            {courses
              .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <div key={c.id} className="sd-course">
                  <div className="sd-course-top">
                    <div className="sd-course-badge">
                      <Star size={14} /> {c.rating}
                    </div>
                    <div className="sd-course-provider">{c.provider}</div>
                  </div>
                  <div className="sd-course-title">{c.title}</div>
                  <div className="sd-progress">
                    <div className="sd-progress-bar" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="sd-course-meta">
                    <span>{c.progress}% complete</span>
                    <button className="sd-btn ghost">
                      Continue
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Tech News */}
        <section className="sd-card stretch">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <Zap size={18} />
              <h2>Latest Articles</h2>
            </div>
            <Link to="/student/articales" className="sd-link">
              View all
              <ChevronRight size={16} />
            </Link>
          </header>

          <div className="sd-news">
            {techNews.length > 0 ? (
              techNews
                .filter(news => 
                  search === "" || 
                  news.title.toLowerCase().includes(search.toLowerCase()) ||
                  news.category.toLowerCase().includes(search.toLowerCase())
                )
                .map((news) => (
                  <Link
                    key={news.id}
                    to={news.url}
                    className="sd-news-item"
                  >
                    <div className="sd-news-image">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                      <div className="sd-news-category">{news.category}</div>
                    </div>
                    <div className="sd-news-content">
                      <div className="sd-news-source">{news.source}</div>
                      <h3 className="sd-news-title">{news.title}</h3>
                      
                      <div className="sd-news-meta">
                        <Clock size={12} />
                        <span>{news.date}</span>
                        <span className="sd-meta-separator">•</span>
                        <span>{news.duration}</span>
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="sd-empty-state">
                <div className="sd-empty-icon">
                  <BookOpen size={24} />
                </div>
                <p>No articles available at the moment</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default StuDashboard;