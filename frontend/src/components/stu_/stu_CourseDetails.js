import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./stu_courses.css";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy course data (Certificate Level only)
  const courses = [
    {
      id: 1,
      title: "Introduction to Python Programming",
      description: "Master the basics of Python for software development. Learn syntax, problem solving, and hands-on coding exercises.",
      img: "https://source.unsplash.com/1000x600/?python,code",
      level: "Certificate Level",
      duration: "6 Months",
      students: 200,
      hours: 150,
      reviews: 10,
    },
    {
      id: 2,
      title: "Web Development with JavaScript",
      description: "Build dynamic, responsive websites using modern JavaScript frameworks and libraries.",
      img: "https://source.unsplash.com/1000x600/?javascript,web",
      level: "Certificate Level",
      duration: "5 Months",
      students: 180,
      hours: 250,
      reviews: 8,
    },
    {
      id: 3,
      title: "Cloud Computing Essentials",
      description: "Understand the fundamentals of cloud computing and deploy applications using popular platforms.",
      img: "https://source.unsplash.com/1000x600/?cloud,technology",
      level: "Certificate Level",
      duration: "4 Months",
      students: 160,
      hours: 180,
      reviews: 6,
    },
  ];

  const course = courses.find((c) => c.id === parseInt(id));

  if (!course) {
    return <p className="not-found">Course not found.</p>;
  }

  return (
    <div className="course-details-page">
      <img src={course.img} alt={course.title} className="course-details-img" />

      <h1 className="course-details-title">{course.title}</h1>
      <p className="course-details-desc">{course.description}</p>

      <div className="course-details-stats">
        <p><strong>Level:</strong> {course.level}</p>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Students Enrolled:</strong> {course.students}</p>
        <p><strong>Total Hours:</strong> {course.hours}</p>
        <p><strong>Reviews:</strong> {course.reviews}</p>
      </div>

      <div className="details-buttons">
        <button className="course-btn-cou">Enroll Now</button>
        <button className="course-btn-cou" onClick={() => navigate(-1)}>Back to Courses</button>
      </div>
    </div>
  );
}

export default CourseDetails;
