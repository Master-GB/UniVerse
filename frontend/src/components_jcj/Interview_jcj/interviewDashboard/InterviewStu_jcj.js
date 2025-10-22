import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BsCalendar, BsThreeDots } from 'react-icons/bs'
import "./interviewStuJCJ.css"

function InterviewStu_jcj() {
  // Mock data for interviews
  const [upcomingInterviews] = useState([
    {
      id: 1,
      title: "Technical Mock with Sarah",
      interviewer: "Sarah Johnson",
      avatar: "https://via.placeholder.com/40x40/1d4ed8/ffffff?text=SJ",
      date: "2025-10-15",
      time: "14:00",
      platform: "Zoom",
      meetingLink: "https://zoom.us/j/example",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Behavioral Interview with Mike",
      interviewer: "Mike Chen",
      avatar: "https://via.placeholder.com/40x40/1d4ed8/ffffff?text=MC",
      date: "2025-10-18",
      time: "10:30",
      platform: "Teams",
      meetingLink: "https://teams.microsoft.com/example",
      status: "pending"
    }
  ]);

  const [pastInterviews] = useState([
    {
      id: 3,
      title: "System Design with Alex",
      interviewer: "Alex Rodriguez",
      date: "2025-09-20",
      rating: 4.5,
      status: "completed"
    },
    {
      id: 4,
      title: "Frontend Interview with Lisa",
      interviewer: "Lisa Wang",
      date: "2025-09-15",
      rating: 5.0,
      status: "completed"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="interview-dashboard-container-jcj">
      {/* Upcoming Interviews */}
      <div className="upcoming-interviews-section-jcj">
        <div className="section-header-with-button-jcj">
          <h2 className="section-title-jcj">Upcoming Interviews</h2>
          {/* Navigate user to the schedule interview page */}
          <Link to="/MIPage/schedule">
            <button className="schedule-interview-btn-jcj">
              + Schedule Interview
            </button>
          </Link>
        </div>
        <div className="interviews-grid-jcj">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="interview-card-jcj">
              <div className="interview-card-header-jcj">
                <h3 className="interview-card-title-jcj">{interview.title}</h3>
                <div className="interview-menu-jcj">
                  <BsThreeDots className="menu-icon-jcj" />
                </div>
              </div>

              <div className="interview-card-content-jcj">
                <div className="interviewer-info-jcj">
                  <img
                    src={interview.avatar}
                    alt={interview.interviewer}
                    className="interviewer-avatar-jcj"
                  />
                  <span className="interviewer-name-jcj">{interview.interviewer}</span>
                </div>

                <div className="interview-details-jcj">
                  <div className="interview-datetime-jcj">
                    <BsCalendar className="datetime-icon-jcj" />
                    <span>{interview.date} at {interview.time}</span>
                  </div>
                </div>

                <div className="interview-actions-jcj">
                  <span
                    className="status-badge-jcj"
                    style={{ backgroundColor: getStatusColor(interview.status) }}
                  >
                    {getStatusText(interview.status)}
                  </span>
                  <button
                    className="join-meeting-btn-jcj"
                    onClick={() => window.open(interview.meetingLink, '_blank')}
                  >
                    Join via {interview.platform}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Interviews */}
      <div className="past-interviews-section-jcj">
        <div className="past-interviews-header-jcj">
          <h2 className="section-title-jcj">Past Interviews</h2>
          <button className="view-summary-btn-jcj">View Summary</button>
        </div>

        <div className="past-interviews-list-jcj">
          {pastInterviews.map((interview) => (
            <div key={interview.id} className="past-interview-item-jcj">
              <div className="past-interview-info-jcj">
                <h4 className="past-interview-title-jcj">{interview.title}</h4>
                <p className="past-interview-details-jcj">
                  {interview.interviewer} • {interview.date}
                </p>
              </div>
              <div className="past-interview-rating-jcj">
                <span className="rating-stars-jcj">
                  {'★'.repeat(Math.floor(interview.rating))}
                  {interview.rating % 1 !== 0 ? '☆' : ''}
                </span>
                <span className="rating-score-jcj">{interview.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InterviewStu_jcj
