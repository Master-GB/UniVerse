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
  const [bookedSessions, setBookedSessions] = useState(() => {
    return JSON.parse(localStorage.getItem('bookedSessions')) || [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Announcements data
  const announcements = [
    {
      id: 1,
      title: 'Campus Reopening Guidelines',
      date: 'Today',
      content: 'The campus will reopen on September 1st with new safety protocols.'
    },
    {
      id: 2,
      title: 'Scholarship Applications Open',
      date: '2 days ago',
      content: 'Apply now for the Fall 2023 scholarship program. Deadline is August 30th.'
    },
    {
      id: 3,
      title: 'Library Extended Hours',
      date: '4 days ago',
      content: 'The library will now be open until 10 PM on weekdays.'
    }
  ];

  useEffect(() => {
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

  const resources = [
    { id: 1, type: "notes", title: "OOP Cheat Sheet", author: "Mentor Team", time: "12 min read" },
    { id: 2, type: "video", title: "SQL Joins in 10 mins", author: "TechMentor", time: "10:45" },
    { id: 3, type: "paper", title: "Past Paper - DS 2023", author: "Exam Cell", time: "PDF" },
    { id: 4, type: "notes", title: "Network Essentials", author: "Academy", time: "18 min read" }
  ];

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

  const filteredResources = resources.filter(r => resourceFilter === "all" || r.type === resourceFilter);

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
            {filteredResources
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
                    <button className="sd-btn ghost">
                      <Download size={16} />
                      Get
                    </button>
                  </div>
                </div>
              ))}
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

        {/* Announcements */}
        <section className="sd-card stretch">
          <header className="sd-card-header">
            <div className="sd-card-title">
              <Megaphone size={18} />
              <h2>Announcements</h2>
            </div>
            <button className="sd-link">
              View all
              <ChevronRight size={16} />
            </button>
          </header>
          <div className="sd-announcements">
            {announcements.map(announcement => (
              <div key={announcement.id} className="sd-announcement-item">
                <div className="sd-announcement-title">{announcement.title}</div>
                <div className="sd-announcement-date">
                  <Calendar size={14} />
                  {announcement.date}
                </div>
                <div className="sd-announcement-content">{announcement.content}</div>
              </div>
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