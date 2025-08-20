import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./stu_footer.css";

const StuFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="stu-footer">
            <div className="stu-footer-container">
                <div className="stu-footer-content">
                    {/* Logo and Description */}
                    <div className="stu-footer-section">
                        <div className="stu-footer-logo">
                            <img src="/Resources/gihan_res/logo.png" alt="UniVerse Logo" className="stu-footer-logo-img" />
                            <span className="stu-footer-logo-text">UniVerse</span>
                        </div>
                        <p className="stu-footer-about">
                            Empowering students with comprehensive academic and career support to achieve their full potential.
                        </p>
                        <div className="stu-social-links">
                            <a href="#" aria-label="Facebook"><FaFacebook /></a>
                            <a href="#" aria-label="Twitter"><FaTwitter /></a>
                            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                            <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="stu-footer-section">
                        <h3 className="stu-footer-title">Quick Links</h3>
                        <ul className="stu-footer-links">
                            <li><Link to="/student/dashboard">Dashboard</Link></li>
                            <li><Link to="/student/courses">Courses</Link></li>
                            <li><Link to="/student/resources">Resources</Link></li>
                            <li><Link to="/student/interview-prep">Interview Prep</Link></li>
                            <li><Link to="/student/paper-support">Paper Support</Link></li>
                            <li><Link to="/student/guidance">Guidance</Link></li>
                            <li><Link to="/student/session">Session</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="stu-footer-section">
                        <h3 className="stu-footer-title">Contact Us</h3>
                        <ul className="stu-contact-info">
                            <li><FaMapMarkerAlt /> 123 University Ave, City, Country</li>
                            <li><FaPhone /> +94 76 123 4567</li>
                            <li><FaEnvelope /> info@university.ac.lk</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="stu-footer-section">
                        <h3 className="stu-footer-title">Newsletter</h3>
                        <p>Subscribe to our newsletter for the latest updates and resources.</p>
                        <form className="stu-newsletter-form">
                            <input type="email" placeholder="Your email address" required />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="stu-footer-bottom">
                    <p>&copy; {currentYear} UniVerse. All rights reserved.</p>
                    <div className="stu-footer-legal">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <span>|</span>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default StuFooter;