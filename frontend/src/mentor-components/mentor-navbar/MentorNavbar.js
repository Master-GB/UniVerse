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
        if (currentPath === '/mentor-dashboard') {
            setActiveTab('overview');
        } else if (currentPath === '/mentor-session-create') {
            setActiveTab('sessions');
        } else if (currentPath === '/mentor-guidance') {
            setActiveTab('guidance');
        } else if (currentPath ==='/mentor-announcement') {
            setActiveTab('announcements');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        if (tab === 'overview') {
            navigate('/mentor-dashboard');
        } else if (tab === 'sessions') {
            navigate('/mentor-session-create');
        } else if (tab === 'guidance') {
            navigate('/mentor-guidance');
        } else if (tab === 'announcements') {
            navigate('/mentor-announcement');
        }
    };

    return (
        // Header
        <header className="header-md">
            <div className="header-content-md">
                <div className="logo-section-md">
                    <img src={UniVerseLogo} alt="Logo" className="logo-image-md" />
                </div>
                <nav className="nav-md">
                    <button
                        className={`nav-btn-md ${activeTab === 'overview' ? 'active-md' : ''}`}
                        onClick={() => handleTabChange('overview')}
                    >
                        OVERVIEW
                    </button>
                    <button
                        className={`nav-btn-md ${activeTab === 'sessions' ? 'active-md' : ''}`}
                        onClick={() => handleTabChange('sessions')}
                    >
                        SESSIONS
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
                </nav>
            </div>
        </header>
    );
};

export default MentorNavbar;