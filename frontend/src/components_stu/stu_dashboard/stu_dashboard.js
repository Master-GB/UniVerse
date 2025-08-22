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
import SessionCard from './SessionCard';

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
  // useEffect(() => {
  //   const fetchTechNews = async () => {
  //     try {
  //       const response = await fetch('https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_API_KEY');
  //       const data = await response.json();
  //       setTechNews(data.articles.map((article, index) => ({
  //         id: index,
  //         title: article.title,
  //         source: article.source.name,
  //         date: new Date(article.publishedAt).toLocaleDateString(),
  //         url: article.url,
  //         image: article.urlToImage
  //       })));
  //     } catch (error) {
  //       console.error('Error fetching tech news:', error);
  //     }
  //   };
  //   fetchTechNews();
  // }, []);

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        console.log('Fetching resources from API...');
        const response = await fetch('http://localhost:8070/resource/display');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', data);
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        if (!data.resources || !Array.isArray(data.resources)) {
          console.warn('Unexpected API response format:', data);
          setResources([]);
        } else {
          console.log('Setting resources:', data.resources);
          setResources(data.resources);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResourcesError(error.message);
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();

    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [sessions, setSessions] = useState([
    { 
      id: 1, 
      title: "Data Structures Clinic", 
      mentor: "Dr. Silva", 
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), 
      time: "3:30 PM",
      duration: "1h 30m",
      startTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 30, 0, 0),
      seats: 6 
    },
    { 
      id: 2, 
      title: "Calculus Booster", 
      mentor: "Prof. Perera", 
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), 
      time: "10:00 AM",
      duration: "2h",
      startTime: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(10, 0, 0, 0),
      seats: 12 
    },
    { 
      id: 3, 
      title: "AI Study Group", 
      mentor: "Meera K.", 
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), 
      time: "9:00 AM",
      duration: "2h",
      startTime: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(9, 0, 0, 0),
      seats: 4 
    }
  ]);

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

  const handleJoinSession = (sessionId) => {
    // In a real app, this would redirect to the session or open a video call
    console.log(`Joining session ${sessionId}`);
    // window.open(`/session/${sessionId}`, '_blank');
  };

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
            <div className="sd-stat-value">3</div>
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
              .filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
              .map((s) => (
                <div key={s.id} className="sd-list-item">
                  <div className="sd-list-left">
                    <div className="sd-avatar">
                      <Users size={16} />
                    </div>
                    <div>
                      <div className="sd-item-title">{s.title}</div>
                      <div className="sd-item-meta">{s.mentor} • {s.date}</div>
                    </div>
                  </div>
                  <div className="sd-list-right">
                    <div className="sd-badge neutral">{s.seats} seats</div>
                    <button className="sd-btn primary">
                      <Calendar size={16} />
                      Book
                    </button>
                  </div>
                </div>
              ))}
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
              // Success state
              filteredResources
                .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
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
              <h2>Articales</h2>
            </div>
            <Link to="/student/articales" className="sd-link">
                 View all
                 <ChevronRight size={16} />
             </Link>
          </header>
          <div className="sd-news">
            {techNews.map(news => (
              <a 
                key={news.id} 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="sd-news-item"
              >
                <div className="sd-news-image">
                  <img src={news.image} alt={news.title} />
                </div>
                <div className="sd-news-content">
                  <div className="sd-news-source">{news.source}</div>
                  <h3 className="sd-news-title">{news.title}</h3>
                  <div className="sd-news-meta">
                    <Clock size={12} />
                    <span>{news.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Footer callout */}
      <div className="sd-callout">
        <div className="sd-callout-left">
          <div className="sd-callout-title">Level up consistently</div>
          <div className="sd-callout-sub">Schedule weekly goals and track progress effortlessly.</div>
        </div>
        <button className="sd-btn primary">
          <Target size={16} />
          Set Goals
        </button>
      </div>
    </div>
  );
};

export default StuDashboard;