import React, { useState } from "react";
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
                            <img src="/Resources/gihan_res/logo.png" alt="UniVerse Logo" className="stu-logo-img" />
                            <span className="stu-logo-text">UniVerse</span>
                        </Link>
                    </div>
                    
                    <div className={`stu-nav-links ${isOpen ? 'stu-active' : ''}`}>
                        <Link to="/student/dashboard" className="stu-nav-link">Dashboard</Link>
                        <Link to="/student/courses" className="stu-nav-link">Courses</Link>
                        <Link to="/student/resources" className="stu-nav-link">Resources</Link>
                        <Link to="/student/interview-prep" className="stu-nav-link">Interview Prep</Link>
                        <Link to="/student/paper-support" className="stu-nav-link">Paper Support</Link>
                        <Link to="/student/guidance" className="stu-nav-link">Guidance</Link>
                    </div>
                    
                    <div className="stu-user-menu">
                        <div className="stu-user-avatar">
                            <span>GB</span>
                        </div>
                        <div className="stu-hamburger" onClick={toggleMenu}>
                            <span className={`stu-bar ${isOpen ? 'stu-active' : ''}`}></span>
                            <span className={`stu-bar ${isOpen ? 'stu-active' : ''}`}></span>
                            <span className={`stu-bar ${isOpen ? 'stu-active' : ''}`}></span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StuNavigation;