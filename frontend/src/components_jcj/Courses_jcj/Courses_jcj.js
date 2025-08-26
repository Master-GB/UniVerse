import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbargreet_jcj/Navbar_jcj";
import Footer from "../LandingPage_jcj/Footer_jcj/Footer_jcj";
import CourseShowcase_jcj from "./CourseContent_jcj/CourseShowcase_jcj";
import "./courses_jcj.css";

function Courses_jcj() {
  return (
    <div>
      <div className="navbar-bg-jcj32">
        <Navbar />
      </div>

      {/* main body of the courses page */}
      <div className="courses-hero-jcj">
        <div className="courses-hero-content-jcj">
          <h1 className="courses-hero-title-jcj">Explore Our Courses</h1>
          <p className="courses-hero-subtitle-jcj">
            Expand your knowledge with a wide range of programs designed to
            empower your academic and professional journey.
          </p>
        </div>
      </div>

      <CourseShowcase_jcj />

      <Footer />
    </div>
  );
}

export default Courses_jcj;
