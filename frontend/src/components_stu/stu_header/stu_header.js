import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./stu_header.css";

const StuNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="stu-header">
      <div className="stu-container">
        <div className="stu-header-content">
          <div className="stu-logo">
            <Link to="/student/dashboard">
              <img
                src="/Resources/gihan_res/logo.png"
                alt="UniVerse Logo"
                className="stu-logo-img"
              />
              <span className="stu-logo-text">UniVerse</span>
            </Link>
          </div>

          <div className={`stu-nav-links ${isOpen ? "stu-active" : ""}`}>
            <Link to="/student/dashboard" className="stu-nav-link">
              Dashboard
            </Link>
            <Link to="/student/courses" className="stu-nav-link">
              Courses
            </Link>
            <div className="stu-dropdown">
              <Link to="#" className="stu-nav-link">
                Resources
                <svg
                  className="stu-dropdown-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="stu-dropdown-content">
                <Link
                  to="/student/academic-resources"
                  className="stu-dropdown-item"
                >
                  Academic Resources
                </Link>
                <Link
                  to="/student/career-resources"
                  className="stu-dropdown-item"
                >
                  Career Resources
                </Link>
              </div>
            </div>

            <div className="stu-dropdown">
              <Link to="/student/Career & Skills" className="stu-nav-link">
                Career & Skills
                <svg
                  className="stu-dropdown-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="stu-dropdown-content">
                <Link to="/student/resume" className="stu-dropdown-item">
                  Resume Builder
                </Link>
                <Link to="/MIPage" className="stu-dropdown-item">
                  Mock Interview
                </Link>
                <Link to="/student/interview_quiz" className="stu-dropdown-item">
                  Interview Quisses
                </Link>
              </div>
            </div>

            <Link to="/student/exam-support" className="stu-nav-link">
              Exam Support
            </Link>
            <Link to="/student/guidance" className="stu-nav-link">
              Guidance
            </Link>
            <div className="stu-dropdown">
              <Link to="#" className="stu-nav-link">
                Session
                <svg
                  className="stu-dropdown-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="stu-dropdown-content">
                <Link
                  to="/student/academic-session"
                  className="stu-dropdown-item"
                >
                  Academic Session
                </Link>
                <Link
                  to="/student/career-session"
                  className="stu-dropdown-item"
                >
                  Career Session
                </Link>
              </div>
            </div>
          </div>

          <div className="stu-user-menu">
            <button className="stu-notification-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C10.9 2 10 2.9 10 4V4.29C7.12 5.14 5 7.83 5 11V17L3 19V20H21V19L19 17V11C19 7.83 16.88 5.14 14 4.29V4C14 2.9 13.1 2 12 2ZM12 6C14.76 6 17 8.24 17 11V18H7V11C7 8.24 9.24 6 12 6Z"
                  fill="currentColor"
                />
                <path
                  d="M12 23C13.1 23 14 22.1 14 21H10C10 22.1 10.9 23 12 23Z"
                  fill="currentColor"
                />
              </svg>
              <span className="stu-notification-badge">3</span>
            </button>
            <div className="stu-user-avatar">
              <span>GB</span>
            </div>
            <div className="stu-hamburger" onClick={toggleMenu}>
              <span className={`stu-bar ${isOpen ? "stu-active" : ""}`}></span>
              <span className={`stu-bar ${isOpen ? "stu-active" : ""}`}></span>
              <span className={`stu-bar ${isOpen ? "stu-active" : ""}`}></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StuNavigation;
