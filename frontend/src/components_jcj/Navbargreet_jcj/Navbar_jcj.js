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
          <li className="navbar-item">
            <a href="/" className="navbar-link">
              Home
            </a>
          </li>
          <li className="navbar-item">
            <a href="/resources" className="navbar-link">
              Resources
            </a>
          </li>
          <li className="navbar-item">
            <a href="/modules" className="navbar-link">
              Modules
            </a>
          </li>
          <li className="navbar-item">
            <a href="/support" className="navbar-link">
              Support
            </a>
          </li>
          <li className="navbar-item">
            <a href="/signup" className="navbar-link">
              Sign Up
            </a>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
