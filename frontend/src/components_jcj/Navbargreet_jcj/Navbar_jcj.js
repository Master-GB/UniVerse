import React from "react";
import { Link } from "react-router-dom";
import "./navbar_jcj.css";
import newlogo from "./universelogo_jcj.png"; // use this to change the logo

function Navbar() {
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
              <a href="/" className="navbar-link">
                Home
              </a>
            </li>
            <li className="navbar-item">
              <Link to="/about" className="navbar-link">
                About Us
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/courses_jcj" className="navbar-link">
                Courses
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/support" className="navbar-link">
                Support
              </Link>
            </li>
          </div>
          <div className="navbar-auth-links-jcj">
            <li className="navbar-item">
              <Link to="/login" className="navbar-auth-link-jcj">
                Login
              </Link>
            </li>
            <li className="navbar-item">
              <a
                href="/signup"
                className="navbar-auth-link-jcj navbar-signup-jcj"
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
