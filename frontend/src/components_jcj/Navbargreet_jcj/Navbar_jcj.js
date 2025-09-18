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
              <a
                href="/"
                className={`navbar-link ${
                  activeLink === "/" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/")}
              >
                Home
              </a>
            </li>
            <li className="navbar-item">
              <Link
                to="/about"
                className={`navbar-link ${
                  activeLink === "/about" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/about")}
              >
                About Us
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/courses_jcj"
                className={`navbar-link ${
                  activeLink === "/courses_jcj" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/courses_jcj")}
              >
                Courses
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/support"
                className={`navbar-link ${
                  activeLink === "/support" ? "active-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/support")}
              >
                Support
              </Link>
            </li>
          </div>
          <div className="navbar-auth-links-jcj">
            <li className="navbar-item">
              <Link
                to="/login"
                className={`navbar-auth-link-jcj ${
                  activeLink === "/login" ? "active-auth-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/login")}
              >
                Login
              </Link>
            </li>
            <li className="navbar-item">
              <a
                href="/signup"
                className={`navbar-auth-link-jcj navbar-signup-jcj ${
                  activeLink === "/signup" ? "active-signup-jcj" : ""
                }`}
                onClick={() => handleLinkClick("/signup")}
              >
                Sign Up
              </a>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
