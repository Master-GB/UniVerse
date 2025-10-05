import React, { useState  } from 'react';
import { Calendar, BookOpen, MessageSquare, Users, Award, TrendingUp, Clock, Video, FileText, Star } from 'lucide-react';
import './MentorDashboard.css';
import MentorNavbar from '../mentor-navbar/MentorNavbar';
import MentorUPSession from '../mentor-dashboard/mentor-upcomming-session/MentorUPSession';
import {Link } from 'react-router-dom';
import { useNavigate ,Navigate} from "react-router-dom";


const MentorDashboard = () => {
 

  const upcomingSessions = [
    { id: 1, student: 'Alice Johnson', time: '2:00 PM', subject: 'Career Guidance', type: 'video' },
    { id: 2, student: 'Mark Wilson', time: '4:30 PM', subject: 'Academic Planning', type: 'chat' },
    { id: 3, student: 'Emma Davis', time: '6:00 PM', subject: 'Interview Prep', type: 'video' }
  ];

  const recentMessages = [
    { id: 1, student: 'Sarah Chen', message: 'Thank you for the resume feedback!', time: '2 mins ago', unread: true },
    { id: 2, student: 'David Kim', message: 'Can we reschedule tomorrow\'s session?', time: '15 mins ago', unread: true },
    { id: 3, student: 'Lisa Brown', message: 'The interview went great!', time: '1 hour ago', unread: false }
  ];

  const stats = [
    { label: 'Total Students', value: '24', icon: Users, trend: '+3 this month', color: 'blue' },
    { label: 'Sessions Completed', value: '156', icon: Video, trend: '+12 this week', color: 'green' },
    { label: 'Avg Rating', value: '4.9', icon: Star, trend: '↗ Excellent', color: 'yellow' },
    { label: 'Response Rate', value: '98%', icon: TrendingUp, trend: 'Top 5%', color: 'purple' }
  ];

  const navigate = useNavigate();
    return (
      <div className="dashboard-container-md">
        {/* Header */}
        <MentorNavbar />

        {/* Main Content */}
        <main className="main-content-md">
          {/* Welcome Section */}
          <div className="welcome-section-md">
            <div className="welcome-text-md">
              <h2 className="welcome-title-md">Welcome To</h2>
              <h3 className="welcome-subtitle-md">Mentor Dashboard</h3>
            </div>
            <div className="floating-elements-md">
              <div className="floating-circle-md circle-1-md"></div>
              <div className="floating-circle-md circle-2-md"></div>
              <div className="floating-circle-md circle-3-md"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid-md">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card-md stat-${stat.color}-md`}>
                <div className="stat-icon-md">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content-md">
                  <h4 className="stat-value-md">{stat.value}</h4>
                  <p className="stat-label-md">{stat.label}</p>
                  <span className="stat-trend-md">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Cards Grid */}
          <div className="action-grid-md">
            <div 
            className="action-card-md primary-card-md"
            onClick={() => navigate("/mentor-session-create")}
            style={{cursor:"pointer"}}
            >
              <div className="card-icon-md">
                <Calendar size={32} />
              </div>
              
              
              <h4 className="card-title-md">Schedule Session</h4>
              


              <p className="card-description-md">Book new mentoring sessions with students</p>
              <div className="card-glow-md"></div>
            </div>
            


            <div
            className="action-card-md secondary-card-md"
            onClick={() => navigate("/mentor-resourcehub")}
            style={{cursor:"pointer"}}
            >
              <div className="card-icon-md">
                <BookOpen size={32} />
              </div>
              <h4 className="card-title-md">Academic Resource Hub</h4>
              <p className="card-description-md">Access learning materials and resources</p>
              <div className="card-glow-md"></div>
            </div>
            
            <div className="action-card-md tertiary-card-md"
            onClick={() => navigate("/mentor-career-resourcehub")}
            style={{cursor:"pointer"}}
            
            >
              <div className="card-icon-md">
                <MessageSquare size={32} />
              </div>
              <h4 className="card-title-md">Career Resource</h4>
              <p className="card-description-md">Career Resource hub </p>
              <div className="card-glow-md"></div>
            </div>
            
            <div className="action-card-md quaternary-card-md"
            onClick={() => navigate("/mentor-add-quiz")}
            style={{cursor:"pointer"}}
            
            >
              <div className="card-icon-md">
                <Award size={32} />
              </div>
              <h4 className="card-title-md">
                Quiz & Papers</h4>
              <p className="card-description-md">Add Pass Papers and Create Quiz</p>
              <div className="card-glow-md"></div>
            </div>
          </div>

          {/* Content Panels */}
          <div className="content-panels-md">
            <MentorUPSession />

            {/* Recent Messages */}
            <div className="panel-md messages-panel-md">
              <div className="panel-header-md">
                <h3 className="panel-title-md">
                  <MessageSquare size={20} />
                  Recent Messages
                </h3>
                <span className="panel-badge-md unread-md">2</span>
              </div>
              <div className="messages-list-md">
                {recentMessages.map(message => (
                  <div key={message.id} className={`message-item-md ${message.unread ? 'unread-message-md' : ''}`}>
                    <div className="message-content-md">
                      <h4 className="message-student-md">{message.student}</h4>
                      <p className="message-text-md">{message.message}</p>
                    </div>
                    <div className="message-meta-md">
                      <span className="message-time-md">{message.time}</span>
                      {message.unread && <div className="unread-dot-md"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Background Animations */}
        <div className="bg-animations-md">
          <div className="bg-wave-md wave-1-md"></div>
          <div className="bg-wave-md wave-2-md"></div>
          <div className="bg-wave-md wave-3-md"></div>
        </div>
      </div>
    
  );
};

export default MentorDashboard;
