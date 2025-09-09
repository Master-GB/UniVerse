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
      // Send enrollment request to backend
      await axios.post(`${API_URL}/api/enrollments`, { courseId: id });
      console.log("Enrolled in course:", id);
      // Redirect to course content page
      navigate(`/courses/${id}/content`);
    } catch (err) {
      setError("Error enrolling: " + err.message);
      console.log("Enrollment error details:", err);
    }
  };

  if (loading) return <p className="loading-coursedetails">Loading...</p>;
  if (error) return <p className="error-coursedetails">{error}</p>;
  if (!course) return <p className="not-found-coursedetails">Course not found.</p>;

  return (
    <div className="course-details-page-coursedetails">
      {/* Course Image */}
      <img
        src={`${API_URL}/Uploads/${course.image}`}
        alt={course.name}
        className="course-details-img-coursedetails"
      />

      {/* Course Header */}
      <h1 className="course-details-title-coursedetails">{course.name}</h1>
      <p className="course-details-stats-coursedetails">
        <strong>Level:</strong> {course.level}
      </p>
      <p className="course-details-stats-coursedetails">
        <strong>Duration:</strong> {course.duration}
      </p>

      {/* Enroll Section */}
      <div className="course-details-full-coursedetails">
        <p className="course-details-desc-coursedetails">{course.description}</p>

        <div className="button-container-dhushi-coursedetails">
          <button className="course-btn-cou-coursedetails" onClick={handleEnroll}>
            Enroll Now
          </button>
          <button className="course-btn-cou-coursedetails" onClick={() => navigate(-1)}>
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;