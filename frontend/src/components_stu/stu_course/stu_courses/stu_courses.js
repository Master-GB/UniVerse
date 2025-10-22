import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./stu_courses.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function StuCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/courses`);
        setCourses(res.data);
        setError("");
      } catch (err) {
        setError("Error fetching courses: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Initialize with empty array if still loading
  const faculties = ["Business", "Computing", "Engineering"];
  const previewCourses = loading || !courses.length 
    ? [] 
    : faculties.map(f => courses.find(c => c.faculty === f)).filter(Boolean);

  return (
    <div className="courses-page-new">
      <div className="courses-content-wrapper">
        <div className="container-StuCourses">
        {/* Hero Section */}
        <div className="hero-StuCourses">
          <div className="hero-text-StuCourses">
            <p className="hero-tag-StuCourses">100% QUALITY COURSES</p>
            <h1 className="hero-title-StuCourses">Find Your Perfect Courses And Improve Your Skills</h1>
            <p className="hero-subtitle-StuCourses">
              “We are here to guide you every step of the way toward achieving your goals and unlocking your true potential.”
            </p>
            <button className="explore-btn-StuCourses" onClick={() => navigate("/s/all-courses")}>
              Explore All Courses →
            </button>
          </div>
          <img
            src="/resourses/image.jpg"
            alt="Students studying together"
            className="hero-img-StuCourses"
          />
        </div>
        {/* Motivation Section */}
        <div className="ceo-message-StuCourses">
          <p className="message-tag-StuCourses">INSPIRATION</p>
          <h1 className="message-title-StuCourses">
            We’re here to guide every student — from first year to final year — toward success
          </h1>
          <p className="message-text-StuCourses">
            No matter if you are just beginning your journey or preparing for your
            final year, we believe every student has the power to achieve great
            things. Our courses in Computing, Business, and Engineering
            are designed to give you the right knowledge and skills at every stage of
            your university life.
          </p>
          <p className="message-text-StuCourses">
            Learning is not just about passing exams — it’s about building confidence,
            discovering your strengths, and preparing for the future. With the right
            guidance, every challenge becomes an opportunity to grow.
          </p>
          <p className="message-text-StuCourses">
            Together, let’s make your university years meaningful, inspiring, and full
            of possibilities. Whether you’re starting fresh or aiming higher, remember
            — we are here to guide you at every step of your academic journey.
          </p>
          <div className="ceo-signature-StuCourses">
            <img
              src="/resourses/student.avif"
              alt="Student"
              className="ceo-photo-StuCourses"
            />
            <p className="signature-text-StuCourses">Guiding Every Student</p>
            <p className="ceo-role-StuCourses">From First Year to Final Year</p>
          </div>
        </div>
        {/* Goal Section */}
        <div className="goal-section-StuCourses">
          <div className="experience-box-StuCourses">
            <p className="experience-tag-StuCourses">more to go</p>
            <img
              src="/resourses/laptop.webp"
              alt="Student with laptop"
              className="experience-img-StuCourses"
            />
          </div>
          <div className="goal-content-StuCourses">
            <p className="goal-tag-StuCourses">WHAT'S OUR MAIN GOAL</p>
            <h1 className="goal-title-StuCourses">
              Take The Next Step Toward Your Personal And Professional Goals With Developers Stack
            </h1>
            <p className="goal-text-StuCourses">
              Embark on a transformative journey towards achieving your personal and professional aspirations with Developers Stack. Our comprehensive suite of tools, resources, and guidance is designed to empower you to take the next step confidently. Let's navigate the path to success together.
            </p>
            <div className="goal-items-StuCourses">
              <div className="goal-item-StuCourses">
                <div className="goal-icon-StuCourses">🛠️</div>
                <h3>Tailored Support</h3>
                <p>Access personalized guidance and support from industry experts to align your goals with actionable strategies.</p>
              </div>
              <div className="goal-item-StuCourses">
                <div className="goal-icon-StuCourses">📈</div>
                <h3>Career Advancement</h3>
                <p>Take advantage of career development resources, job placement assistance, and exclusive opportunities to propel your professional journey forward.</p>
              </div>
              <div className="goal-item-StuCourses">
                <div className="goal-icon-StuCourses">🤝</div>
                <h3>Community Engagement</h3>
                <p>Join a vibrant community of like-minded individuals, fostering collaboration, learning, and growth, as you strive towards your personal and professional goals.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Banner Section */}
        <div className="banner-section-StuCourses">
          <div className="banner-item-StuCourses">
            <div className="banner-icon-StuCourses">🚀</div>
            <h3>Get Archive to the Next Level</h3>
            <p>Elevate achieving efficiency and productivity with our enhancements.</p>
          </div>
          <div className="banner-item-StuCourses">
            <div className="banner-icon-StuCourses">💡</div>
            <h3>Learn Effectively with Us</h3>
            <p>Unlock effective learning experiences tailored to your needs with our comprehensive platform.</p>
          </div>
          <div className="banner-item-StuCourses">
            <div className="banner-icon-StuCourses">🏆</div>
            <h3>Award-Winning Team</h3>
            <p>Experience unparalleled expertise and innovation with our award-winning team.</p>
          </div>
        </div>
        {/* Unique Courses Preview */}
        {/* Unique Courses Preview */}
<div className="unique-courses-StuCourses">
  <p className="unique-tag-StuCourses">UNIQUE COURSES</p>
  <h1 className="unique-title-StuCourses">
    Explore Courses from Each Faculty
  </h1>
  <div className="courses-grid-StuCourses preview-grid-StuCourses">
    {previewCourses.length > 0 ? (
      previewCourses.map((course) => (
        <div
          key={course._id}
          className="course-card-StuCourses"
          onClick={() => navigate(`/s/courses/${course._id}`, { state: { course } })}
        >
          <img
            src={course.image ? `${API_URL}/Uploads/${course.image}` : "/resourses/DDDollars.png"}
            alt={course.coursename}
            className="course-img-StuCourses"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/resourses/DDDollars.png";
            }}
          />
          <div className="course-body-StuCourses">
            <p className="course-level-StuCourses">{course.faculty}</p>
            <h2 className="course-title-StuCourses">{course.coursename}</h2>
            <p className="course-conducting-StuCourses">Duration: {course.duration}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="no-courses-StuCourses">No courses available.</p>
    )}
  </div>
</div>

        {/* Explore All Courses Button */}
        <div className="explore-all-StuCourses">
          <button className="explore-btn-StuCourses" onClick={() => navigate("/s/all-courses")}>
            Explore All Courses →
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default StuCourses;