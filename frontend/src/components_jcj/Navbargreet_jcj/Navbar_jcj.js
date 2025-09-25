import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar_jcj.css";
import newlogo from "./universelogo_jcj.png"; // use this to change the logo

function Navbar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  // Update active link based on current route
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <div className="navbar-logo">
          <img src={newlogo} alt="Company Logo" height="40" />
        </div>

        {/* Menu items on the right */}
        <ul className="navbar-menu">
          <div className="navbar-main-links-jcj">
            <li className="navbar-item">
              <Link
                to="/landing"
                className={`navbar-link ${
                  activeLink === "/landing" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/landing")}
              >
                Home
              </Link>
            </li>

            <li className="navbar-item">
              <Link
                to="/landing/about"
                className={`navbar-link ${
                  activeLink === "/landing/about" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/landing/about")}
              >
                About Us
              </Link>
            </li>

            <li className="navbar-item">
              <Link
                to="/landing/courses_jcj"
                className={`navbar-link ${
                  activeLink === "/landing/courses_jcj" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/landing/courses_jcj")}
              >
                Courses
              </Link>
            </li>

            <li className="navbar-item">
              <Link
                to="/landing/support"
                className={`navbar-link ${
                  activeLink === "/landing/support" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/landing/support")}
              >
                Support
              </Link>
            </li>
          </div>

          <div className="navbar-auth-links-jcj">
            <li className="navbar-item">
              <Link
                to="/landing/login"
                className={`navbar-auth-link-jcj ${
                  activeLink === "/landing/login" ? "active-auth-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/landing/login")}
              >
                Login
              </Link>
            </li>

            <li className="navbar-item">
              <Link
                to="/landing/signup"
                className={`navbar-auth-link-jcj navbar-signup-jcj ${
                  activeLink === "/landing/signup" ? "active-signup-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/landing/signup")}
              >
                Sign Up
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
