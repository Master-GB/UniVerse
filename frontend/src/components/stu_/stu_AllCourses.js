import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./stu_courses.css";

function AllCourses() {
  const faculties = ["All Categories", "Business", "Computing", "Engineering"];
  const [faculty, setFaculty] = useState("All Categories");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Dummy Data
  const allCourses = {
    Business: [
      { id: 1, title: "Fundamentals of Business Management", description: "Master the essentials of managing a business effectively.", img: "https://source.unsplash.com/400x200/?business,office", level: "Diploma Level", conducting: "Online + Onsite", students: 88, hours: 600, reviews: 12 },
      { id: 2, title: "Digital Marketing Strategies", description: "Learn advanced techniques for online marketing campaigns.", img: "https://source.unsplash.com/400x200/?marketing,digital", level: "Certificate Level", conducting: "Online", students: 120, hours: 450, reviews: 8 },
    ],
    Computing: [
      { id: 3, title: "Introduction to Python Programming", description: "Learn the basics of Python for software development.", img: "https://source.unsplash.com/400x200/?python,programming", level: "Certificate Level", conducting: "Online", students: 200, hours: 150, reviews: 10 },
      { id: 4, title: "Web Development with JavaScript", description: "Build dynamic websites using JavaScript and frameworks.", img: "https://source.unsplash.com/400x200/?web,development", level: "Diploma Level", conducting: "Onsite", students: 180, hours: 250, reviews: 7 },
    ],
    Engineering: [
      { id: 5, title: "Civil Engineering Design", description: "Learn the fundamentals of civil infrastructure design.", img: "https://source.unsplash.com/400x200/?civil,engineering", level: "Diploma Level", conducting: "Onsite", students: 90, hours: 350, reviews: 5 },
      { id: 6, title: "Mechanical Engineering Principles", description: "Study the core concepts of mechanical systems.", img: "https://source.unsplash.com/400x200/?mechanical,engineering", level: "Diploma Level", conducting: "Hybrid", students: 85, hours: 320, reviews: 3 },
    ],
  };

  // Filtered courses
  let selectedCourses = faculty === "All Categories"
    ? Object.values(allCourses).flat()
    : allCourses[faculty] || [];

  const filteredCourses = selectedCourses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-cou">
      <div className="full-courses-section">
        <div className="faculty-buttons-cou">
          {faculties.map((f) => (
            <button
              key={f}
              onClick={() => setFaculty(f)}
              className={`faculty-btn-cou ${faculty === f ? "active-cou" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="search-bar-cou">
          <input
            type="text"
            placeholder="Search program here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="courses-grid-cou">
          {filteredCourses.map((course) => (
            <div key={course.id} className="course-card-cou">
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
                <button
                  className="course-btn-cou"
                  onClick={() => navigate(`/courses/${course.id}`, { state: { course } })}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <p className="no-courses-cou">No courses match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default AllCourses;







