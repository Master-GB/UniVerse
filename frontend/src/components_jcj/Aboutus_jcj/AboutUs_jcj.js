import React from "react";
import "./aboutUs_jcj.css";
import Navbar_jcj from "../Navbargreet_jcj/Navbar_jcj";
import Footer_jcj from "../LandingPage_jcj/Footer_jcj/Footer_jcj";

const AboutUs_jcj = () => {
  return (
    <div>
      <div className="aboutus-navbar-jcj">
        {/* Navbar */}
        <Navbar_jcj />
      </div>
      <div className="aboutus-container-jcj">
        {/* Header */}
        <h1 className="aboutus-title-jcj">About UniVerse</h1>
        <p className="aboutus-intro-jcj">
          UniVerse is an academic and career support platform built to help
          students bridge the gap between study and the professional world. We
          centralize learning materials, mock interviews, quizzes, and career
          resources so students can prepare with confidence.
        </p>
        <p className="aboutus-intro-jcj">
          Our mentor network offers personalised guidance, helping students
          explore career paths, sharpen job-ready skills, and connect with
          industry professionals.
        </p>
        {/* Hero Section */}
        <div className="aboutus-hero-jcj fade-in-up-jcj">
          <div className="aboutus-hero-text-jcj">
            <h2>Prepared for study. Ready for work.</h2>
            <p>
              UniVerse combines curated learning resources, hands-on practice,
              and mentor coaching to make students academically strong and
              professionally ready. Practice mock interviews, take timed
              quizzes, and receive feedback from industry-aligned mentors.
            </p>
            <a href="/get-started" className="aboutus-btn-jcj">
              Get started →
            </a>
          </div>
          <div className="aboutus-hero-img-jcj">
            <img
              src="https://images.pexels.com/photos/2943603/pexels-photo-2943603.jpeg"
              alt="AU campus"
            />
          </div>
        </div>
        {/* Cards Section */}
        <div className="aboutus-cards-jcj">
          {[
            {
              title: "What we offer",
              desc: "Centralized course materials, curated readings, and practice exercises that align with common academic syllabi and industry needs.",
              link: "Explore resources →",
            },
            {
              title: "Mentor support",
              desc: "One-on-one mentoring and group coaching from experienced professionals who provide career advice, feedback, and mock interview coaching.",
              link: "Meet our mentors →",
            },
            {
              title: "Mock interviews",
              desc: "Realistic interview simulations with guided feedback to help students improve answers, timing, and confidence.",
              link: "Try a mock interview →",
            },
            {
              title: "Quizzes & assessments",
              desc: "Timed quizzes and skill assessments with instant scoring to help learners identify strengths and focus areas.",
              link: "Take a quiz →",
            },
            {
              title: "Career pathways",
              desc: "Guides, sample CVs, and role-specific learning plans to help students map steps from study to meaningful employment.",
              link: "Explore careers →",
            },
            {
              title: "Community & events",
              desc: "Workshops, webinars, and peer study groups where students can network and practice skills together.",
              link: "See upcoming events →",
            },
          ].map((card, idx) => (
            <div key={idx} className="aboutus-card-jcj fade-in-up-jcj">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <a href="#">{card.link}</a>
            </div>
          ))}
        </div>
        {/* Footer */}
      </div>
      <Footer_jcj />
    </div>
  );
};

export default AboutUs_jcj;
