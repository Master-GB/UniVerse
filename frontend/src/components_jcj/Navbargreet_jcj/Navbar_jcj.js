import React from "react";
import "./navbar_jcj.css";
import newlogo from "./logotext_jcj.ico"; // use this to change the logo

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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
