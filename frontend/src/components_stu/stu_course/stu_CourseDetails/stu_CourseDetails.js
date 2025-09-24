import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./stu_CourseDetails.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!course);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/courses/${id}`);
          setCourse(res.data);
          setError("");
        } catch (err) {
          setError(
            "Error fetching course: " + (err.response?.data?.message || err.message)
          );
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, course]);

  const handleEnroll = async () => {
    try {
      await axios.post(`${API_URL}/api/enrollments`, { courseId: id });
      navigate(`/courses/${id}/content`);
    } catch (err) {
      setError("Error enrolling: " + err.message);
    }
  };

  if (loading) return <div className="course-details-loading">Loading course details...</div>;
  if (error) return <div className="course-details-error">{error}</div>;
  if (!course) return <div className="course-details-notfound">Course not found.</div>;

  return (
    <div className="course-details-container">
      <div className="course-content-wrapper">
        <div className="course-details-card">
          <div className="course-image-section">
            <img
              src={`${API_URL}/Uploads/${course.image}`}
              alt={course.name}
              className="course-details-image"
            />
          </div>
          
          <div className="course-content-section">
            <h1 className="course-details-title">{course.name}</h1>
            
            <div className="course-meta-info">
              <div className="meta-item">
                <span className="meta-label">Level:</span>
                <span className="meta-value">{course.level}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{course.duration}</span>
              </div>
            </div>

            <div className="course-description">
              <h3 className="description-title">Course Description</h3>
              <p className="description-text">{course.description}</p>
            </div>

            <div className="course-actions">
              <button className="btn-primary" onClick={handleEnroll}>
                Enroll Now
              </button>
              <button className="btn-secondary" onClick={() => navigate(-1)}>
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;