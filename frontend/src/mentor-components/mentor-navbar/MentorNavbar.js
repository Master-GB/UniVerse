import React, { useState, useEffect } from "react";
import './MentorNavbar.css';
import { useNavigate, useLocation } from "react-router-dom";

import UniVerseLogo from "../mentor-resouce/UniVerseLogo.png";

const MentorNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');

    // Update activeTab based on current route
    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === '/mentor/dashboard') {
            setActiveTab('overview');
        } else if (currentPath === '/mentor/session-create') {
            setActiveTab('academic-sessions');
        } else if (currentPath === '/mentor/career-session') {
            setActiveTab('career-sessions');
        } else if (currentPath === '/mentor/guidance') {
            setActiveTab('guidance');
        } else if (currentPath === '/mentor/announcement') {
            setActiveTab('announcements');
        } else if (currentPath === '/mentor/article') {
            setActiveTab('articles');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        // Use switch statement for cleaner navigation logic
        switch(tab) {
            case 'overview':
                navigate('/mentor/dashboard');
                break;
            case 'academic-sessions':
                navigate('/mentor/session-create');
                break;
            case 'career-sessions':
                navigate('/mentor/career-session');
                break;
            case 'guidance':
                navigate('/mentor/guidance');
                break;
            case 'announcements':
                navigate('/mentor/announcement');
                break;
            case 'articles':
                navigate('/mentor/article');
                break;
            default:
                navigate('/mentor/dashboard');
        }
    };

    return (
        <div className="mentor-navbar-container">
            <header className="header-md">
                <div className="header-content-md">
                    <div className="logo-section-md">
                        <img src={UniVerseLogo} alt="UniVerse Logo" className="logo-image-md" />
                    </div>
                    <nav className="nav-md">
                        <button
                            className={`nav-btn-md ${activeTab === 'overview' ? 'active-md' : ''}`}
                            onClick={() => handleTabChange('overview')}
                        >
                            OVERVIEW
                        </button>
                        <button
                            className={`nav-btn-md ${activeTab === 'academic-sessions' ? 'active-md' : ''}`}
                            onClick={() => handleTabChange('academic-sessions')}
                        >
                            ACADEMIC SESSIONS
                        </button>
                        <button
                            className={`nav-btn-md ${activeTab === 'career-sessions' ? 'active-md' : ''}`}
                            onClick={() => handleTabChange('career-sessions')}
                        >
                            CAREER SESSIONS
                        </button>
                        <button
                            className={`nav-btn-md ${activeTab === 'guidance' ? 'active-md' : ''}`}
                            onClick={() => handleTabChange('guidance')}
                        >
                            GUIDANCE
                        </button>
                        <button
                            className={`nav-btn-md ${activeTab === 'announcements' ? 'active-md' : ''}`}
                            onClick={() => handleTabChange('announcements')}
                        >
                            ANNOUNCEMENTS
                        </button>
                        <button
                            className={`nav-btn-md ${activeTab === 'articles' ? 'active-md' : ''}`}
                            onClick={() => handleTabChange('articles')}
                        >
                            ARTICLES
                        </button>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default MentorNavbar;