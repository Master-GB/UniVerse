import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./stu_AllCourses.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function AllCourses() {
  const faculties = ["All Categories", "Business", "Computing", "Engineering"];
  const [faculty, setFaculty] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const selectedCourses =
    faculty === "All Categories"
      ? courses
      : courses.filter(c => c.faculty === faculty);

  const filteredCourses = selectedCourses.filter(course => {
    // defensive: ensure title is always a string before calling toLowerCase
    const title = String(course && (course.name || course.coursename) || "");
    return title.toLowerCase().includes(String(search || "").toLowerCase());
  });

  return (

    <div className="all-courses-page">
      <div className="container-allcourse">
        <div className="full-courses-section-allcourse">
          <div className="faculty-buttons-allcourse">
            {faculties.map(f => (
              <button
                key={f}
                onClick={() => setFaculty(f)}
                className={`faculty-btn-allcourse ${faculty === f ? "active-allcourse" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="search-bar-allcourse">
            <input
              type="text"
              placeholder="Search program here"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="courses-grid-allcourse">
            {filteredCourses.map(course => (
              <div key={course._id} className="course-card-allcourse">
                <img
                  src={`${API_URL}/Uploads/${course.image}`}
                  alt={(course.name || course.coursename || '')}
                  className="course-img-allcourse"
                />
                <div className="course-body-allcourse">
                  <p className="course-level-allcourse">{course.level}</p>
                  <h2 className="course-title-allcourse">{course.name || course.coursename}</h2>
                  <p className="course-conducting-allcourse">Duration: {course.duration}</p>
                  <button
                    className="course-btn-allcourse"
                    onClick={() =>
                      navigate(`/courses/${course._id}`, { state: { course } })
                    }
                  >
                    view more
                  </button>
                </div>
              </div>
            ))}
            {filteredCourses.length === 0 && (
              <p className="no-courses-allcourse">No courses match your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllCourses;