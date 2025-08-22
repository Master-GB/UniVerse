import React from "react";
import "./footer_jcj.css";
import InstagramIcon from "./icons_jcj/insta.svg";
import FacebookIcon from "./icons_jcj/facebook.svg";
import YouTubeIcon from "./icons_jcj/youtube.svg";
import footerlogo from "./icons_jcj/footerlogo_jcj.png";

export default function Footer() {
  return (
    <footer className="jcj-footer">
      <div className="jcj-footer-container">
        {/* Main Footer Content */}
        <div className="jcj-footer-content">
          {/* Company Info */}
          <div className="jcj-footer-section">
            {/* company logo */}
            <img
              src={footerlogo}
              alt="UniVerse Logo"
              className="jcj-footer-logo"
            />

            <p className="jcj-footer-description">
              Empowering your academic and career journey with comprehensive
              resources and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="jcj-footer-section">
            <h4 className="jcj-footer-heading">Quick Links</h4>
            <ul className="jcj-footer-links">
              <li>
                <a href="/about" className="jcj-footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="/resources" className="jcj-footer-link">
                  Resources
                </a>
              </li>
              <li>
                <a href="/career-guidance" className="jcj-footer-link">
                  Career Guidance
                </a>
              </li>
              <li>
                <a href="/study-materials" className="jcj-footer-link">
                  Study Materials
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="jcj-footer-section">
            <h4 className="jcj-footer-heading">Support</h4>
            <ul className="jcj-footer-links">
              <li>
                <a href="/contact" className="jcj-footer-link">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="jcj-footer-link">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/faq" className="jcj-footer-link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/support" className="jcj-footer-link">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="jcj-footer-section">
            <h4 className="jcj-footer-heading">Legal</h4>
            <ul className="jcj-footer-links">
              <li>
                <a href="/privacy" className="jcj-footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="jcj-footer-link">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookies" className="jcj-footer-link">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="jcj-footer-bottom">
          <div className="jcj-footer-bottom-content">
            <p className="jcj-footer-copyright">
              © 2025 UniVerse. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="jcj-social-links">
              <a
                href="https://instagram.com"
                className="jcj-social-link"
                aria-label="Instagram"
              >
                <img
                  src={InstagramIcon}
                  alt="Instagram"
                  className="jcj-social-icon"
                />
              </a>
              <a
                href="https://facebook.com"
                className="jcj-social-link"
                aria-label="Facebook"
              >
                <img
                  src={FacebookIcon}
                  alt="Facebook"
                  className="jcj-social-icon"
                />
              </a>
              <a
                href="https://youtube.com"
                className="jcj-social-link"
                aria-label="YouTube"
              >
                <img
                  src={YouTubeIcon}
                  alt="YouTube"
                  className="jcj-social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
