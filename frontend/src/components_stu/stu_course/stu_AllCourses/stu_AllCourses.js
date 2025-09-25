import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./stu_AllCourses.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function Stu_AllCourses() {
  const faculties = ["All Categories", "Business", "Computing", "Engineering"];
  const [faculty, setFaculty] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/api/courses/display`);
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const selectedCourses =
    faculty === "All Categories"
      ? courses
      : courses.filter(c => c.faculty === faculty);

  const filteredCourses = selectedCourses.filter(course => {
    const title = String(course?.name || course?.coursename || "");
    return title.toLowerCase().includes(String(search || "").toLowerCase());
  });

  return (
    <div className="all-courses-page">
      <div className="courses-content-wrapper">
        <div className="container-allcourse">
          <div className="full-courses-section-allcourse">
            <div className="page-header-allcourse">
              <h1 className="page-title-allcourse">Course Catalog</h1>
              <p className="page-subtitle-allcourse">
                Discover our comprehensive range of cutting-edge programs designed to advance your career
              </p>
            </div>

            <div className="controls-container-allcourse">
              <div className="search-container-allcourse">
                <div className="search-bar-allcourse">
                  <div className="search-icon-allcourse">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="faculty-filter-allcourse">
                <div className="filter-label-allcourse">Filter by Faculty:</div>
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
              </div>
            </div>

            {isLoading ? (
              <div className="loading-container-allcourse">
                <div className="loading-spinner-allcourse"></div>
                <p>Loading programs...</p>
              </div>
            ) : (
              <div className="courses-grid-allcourse">
                {filteredCourses.map(course => (
                  <div key={course._id} className="course-card-allcourse">
                    <div className="course-image-container-allcourse">
                      <img
                        src={`${API_URL}/Uploads/${course.image}`}
                        alt={course.name || course.coursename || ""}
                        className="course-img-allcourse"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiMxQzJEMjgiLz48cGF0aCBkPSJNMTQwIDkwTDEzMCAxMDBIMTBMOTAgNzBINzBMNTAgMTEwSDEzMEwxNDAgMTAwTDE1MCAxMTBIMjMwTDIxMCA3MEgxOTBMMTcwIDEwMEwxNDAgOTBaIiBmaWxsPSIjMjc1QjUxIi8+PHRleHQgeD0iMTQwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzhBQUJBNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q291cnNlIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <div className="course-level-allcourse">{course.level}</div>
                      <div className="course-faculty-allcourse">{course.faculty}</div>
                    </div>
                    <div className="course-body-allcourse">
                      <h2 className="course-title-allcourse">{course.name || course.coursename}</h2>
                      <div className="course-details-allcourse">
                        <div className="course-detail-item-allcourse">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Duration: {course.duration}</span>
                        </div>
                      </div>
                      <button
                        className="course-btn-allcourse"
                        onClick={() =>
                          navigate(`/courses/${course._id}`, { state: { course } })
                        }
                      >
                        View Program Details
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredCourses.length === 0 && (
                  <div className="no-courses-container-allcourse">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path d="M9.5 11L11 9.5M11 9.5L12.5 8M11 9.5L9.5 8M11 9.5L12.5 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No programs match your criteria</h3>
                    <p>Try adjusting your search or filter parameters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stu_AllCourses;