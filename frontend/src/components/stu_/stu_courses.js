import React from "react";
import { useNavigate } from "react-router-dom";
import "./stu_courses.css";


function StuCourses() {
  const navigate = useNavigate();

  // Preview courses: 1 from each of the first 4 faculties
  const previewCourses = [
    { title: "Fundamentals of Business Management", description: "Master the essentials of managing a business effectively.", img: "https://source.unsplash.com/400x200/?business,office", level: "Diploma Level", conducting: "1 + Conducting mediums", students: 88, hours: 600, reviews: 0 },
    { title: "Introduction to Python Programming", description: "Learn the basics of Python for software development.", img: "https://source.unsplash.com/400x200/?python,programming", level: "Certificate Level", conducting: "1 + Conducting mediums", students: 200, hours: 150, reviews: 10 },
    { title: "Civil Engineering Design", description: "Learn the fundamentals of civil infrastructure design.", img: "https://source.unsplash.com/400x200/?civil,engineering", level: "Diploma Level", conducting: "1 + Conducting mediums", students: 90, hours: 350, reviews: 4 },
    { title: "Human Anatomy and Physiology", description: "Study the structure and function of the human body.", img: "https://source.unsplash.com/400x200/?anatomy,medicine", level: "Diploma Level", conducting: "1 + Conducting mediums", students: 130, hours: 500, reviews: 9 },
  ];

  return (
    <div className="container-cou">
   

      {/* Hero Section */}
      <div className="hero-cou">
        <div className="hero-text">
          <p className="hero-tag">100% QUALITY COURSES</p>
          <h1 className="hero-title">Find Your Perfect Courses And Improve Your Skills</h1>
          <p className="hero-subtitle">“We are here to guide you every step of the way toward achieving your goals and unlocking your true potential.” </p>
          <button className="explore-btn" onClick={() => navigate("/all-courses")}>Explore All Courses →</button>
        </div>
<img
  src="/dhushi_resourses/University-Student-PNG-Free-Download.png"
  alt="University Student"
/>

      </div>

  {/* Motivation Section */}
<div className="ceo-message">
  <p className="message-tag">INSPIRATION</p>
  <h1 className="message-title">
    We’re here to guide every student — from first year to final year — toward success
  </h1>
  <p className="message-text">
    No matter if you are just beginning your journey or preparing for your
    final year, we believe every student has the power to achieve great
    things. Our courses in Computing, Business, Law, Medicine, and Engineering
    are designed to give you the right knowledge and skills at every stage of
    your university life.
  </p>
  <p className="message-text">
    Learning is not just about passing exams — it’s about building confidence,
    discovering your strengths, and preparing for the future. With the right
    guidance, every challenge becomes an opportunity to grow.
  </p>
  <p className="message-text">
    Together, let’s make your university years meaningful, inspiring, and full
    of possibilities. Whether you’re starting fresh or aiming higher, remember
    — we are here to guide you at every step of your academic journey.
  </p>
  <div className="ceo-signature">
   <img
  src="/dhushi_resourses/student.avif"
  alt="Student"
  className="ceo-photo"
/>

    <p className="signature-text">Guiding Every Student</p>
    <p className="ceo-role">From First Year to Final Year</p>
  </div>
</div>


      {/* Goal Section */}
      <div className="goal-section">
        <div className="experience-box">
          <p className="experience-tag">more to go</p>
<img 
  src="/dhushi_resourses/laptop.webp" 
  alt="Student with laptop" 
  className="experience-img" 
/>

        </div>
        <div className="goal-content">
          <p className="goal-tag">WHAT'S OUR MAIN GOAL</p>
          <h1 className="goal-title">Take The Next Step Toward Your Personal And Professional Goals With Developers Stack</h1>
          <p className="goal-text">Embark on a transformative journey towards achieving your personal and professional aspirations with Developers Stack. Our comprehensive suite of tools, resources, and guidance is designed to empower you to take the next step confidently. Let's navigate the path to success together.</p>
          <div className="goal-items">
            <div className="goal-item">
              <div className="goal-icon">🛠️</div>
              <h3>Tailored Support</h3>
              <p>Access personalized guidance and support from industry experts to align your goals with actionable strategies.</p>
            </div>
            <div className="goal-item">
              <div className="goal-icon">📈</div>
              <h3>Career Advancement</h3>
              <p>Take advantage of career development resources, job placement assistance, and exclusive opportunities to propel your professional journey forward.</p>
            </div>
            <div className="goal-item">
              <div className="goal-icon">🤝</div>
              <h3>Community Engagement</h3>
              <p>Join a vibrant community of like-minded individuals, fostering collaboration, learning, and growth, as you strive towards your personal and professional goals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="banner-section">
        <div className="banner-item">
          <div className="banner-icon">🚀</div>
          <h3>Get Archive to the Next Level</h3>
          <p>Elevate achieving efficiency and productivity with our enhancements.</p>
        </div>
        <div className="banner-item">
          <div className="banner-icon">💡</div>
          <h3>Learn Effectively with Us</h3>
          <p>Unlock effective learning experiences tailored to your needs with our comprehensive platform.</p>
        </div>
        <div className="banner-item">
          <div className="banner-icon">🏆</div>
          <h3>Award-Winning Team</h3>
          <p>Experience unparalleled expertise and innovation with our award-winning team.</p>
        </div>
      </div>

      {/* Unique Courses Preview */}
      <div className="unique-courses">
        <p className="unique-tag">UNIQUE COURSES</p>
        <h1 className="unique-title">You May Also Like More Courses from Developers Stack.</h1>
        <div className="courses-grid-cou preview-grid">
          {previewCourses.map((course, idx) => (
            <div key={idx} className="course-card-cou">
              <img src={course.img} alt={course.title} className="course-img-cou" />
              <div className="course-body-cou">
                <p className="course-level">{course.level}</p>
                <h2 className="course-title-cou">{course.title}</h2>
                <p className="course-description-cou">{course.description}</p>
                <p className="course-conducting">{course.conducting}</p>
                <div className="course-stats">
                  <span>{course.students} Students</span>
                  <span>{course.hours} Hours</span>
                  <span>{course.reviews} Reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore All Courses Button */}
      <div className="explore-all">
        <button className="explore-btn" onClick={() => navigate("/all-courses")}>Explore All Courses →</button>
      </div>
    </div>
  );
}

export default StuCourses;