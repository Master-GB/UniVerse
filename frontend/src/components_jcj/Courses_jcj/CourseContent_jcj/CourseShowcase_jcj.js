import React from "react";
import "./courseShowcase_jcj.css";

function CourseShowcase_jcj() {
  const courses = [
    {
      id: 1,
      title: "Information Technology",
      description:
        "Dive into the world of IT with hands-on learning in programming, networks, and system design.",
      icon: "💻",
    },
    {
      id: 2,
      title: "Engineering",
      description:
        "Explore mechanical, electrical, and civil engineering principles that shape our world.",
      icon: "⚙️",
    },
    {
      id: 3,
      title: "Business Management",
      description:
        "Learn essential business skills from leadership to entrepreneurship and finance.",
      icon: "📊",
    },
    {
      id: 4,
      title: "Health Sciences",
      description:
        "Gain knowledge in healthcare systems, medical technology, and community well-being.",
      icon: "🩺",
    },
  ];

  return (
    <div className="course-showcase-container-jcj">
      <h2 className="course-showcase-title-jcj">Available Courses</h2>
      <div className="course-cards-wrapper-jcj">
        {courses.map((course) => (
          <div key={course.id} className="course-card-jcj">
            <div className="course-icon-jcj">{course.icon}</div>
            <h3 className="course-name-jcj">{course.title}</h3>
            <p className="course-description-jcj">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseShowcase_jcj;
