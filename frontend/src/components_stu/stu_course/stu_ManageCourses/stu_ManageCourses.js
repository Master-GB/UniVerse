import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./stu_ManageCourses.css";

// API Configuration
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8070";
const API_URL = `${API_BASE}/api/courses`;

// Icon Components with Dark Theme Colors
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);
const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF5350">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);
const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V4c0-1.11-.89-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
  </svg>
);
const QuestionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

function ManageCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    faculty: "",
    description: "",
    level: "Certificate Level",
    duration: "",
    image: null,
    videos: [],
    videosText: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/`);
      setCourses(res.data);
      setError("");
    } catch (err) {
      setError("Error fetching courses: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setFileName(file.name);
    }
  };

  const handleVideosChange = (e) => {
    const text = e.target.value;
    setForm({
      ...form,
      videosText: text,
      videos: text.split("\n").filter((v) => v.trim() !== "")
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      faculty: "",
      description: "",
      level: "Certificate Level",
      duration: "",
      image: null,
      videos: [],
      videosText: ""
    });
    setFileName("");
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.faculty || !form.duration) {
      setError("Faculty, Course Name and Duration are required");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("faculty", form.faculty);
      formData.append("description", form.description);
      formData.append("level", form.level);
      formData.append("duration", form.duration);
      if (form.image) formData.append("image", form.image);
      if (form.videos.length > 0)
        formData.append("videos", JSON.stringify(form.videos));

      let res;
      if (editingCourse) {
        res = await axios.put(`${API_URL}/${editingCourse._id}`, formData);
        setSuccess("✅ Course updated successfully!");
      } else {
        res = await axios.post(`${API_URL}/`, formData);
        setSuccess("🎉 Course added successfully!");
        navigate(`/s/student/courses/${res.data._id}/questions`);
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      setError("Error saving course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this course?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess("🗑️ Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      setError("Error deleting course: " + err.message);
    }
  };

  const handleEdit = (course) => {
    setForm({
      name: course.name,
      faculty: course.faculty,
      description: course.description,
      level: course.level || "Certificate Level",
      duration: course.duration,
      image: null,
      videos: course.videos || [],
      videosText: (course.videos || []).join("\n")
    });
    setEditingCourse(course);
    setShowForm(true);
  };

  return (
    
    <div className="manage-courses-container">
      <div className="manage-courses-wrapper">
        <h1>Manage Courses</h1>
        <p className="manage-courses-subtitle">
          Add, update, and manage your courses with ease.
        </p>

        {success && <div className="manage-courses-success">{success}</div>}
        {error && <div className="manage-courses-error">{error}</div>}
        {loading && <div className="manage-courses-loading">Loading...</div>}

        <button
          className="manage-courses-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <PlusIcon /> {showForm ? "Close Form" : "Add New Course"}
        </button>

        {showForm && (
          <div className="manage-courses-form-card">
            <h2>{editingCourse ? "Edit Course" : "Add Course"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="manage-courses-form-grid">
                <div className="manage-courses-form-field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Course Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="manage-courses-form-field">
                  <select
                    name="faculty"
                    value={form.faculty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Faculty</option>
                    <option value="Computing">Faculty of Computing</option>
                    <option value="Business">Faculty of Business</option>
                    <option value="Engineering">Faculty of Engineering</option>
                  </select>
                </div>
                <div className="manage-courses-form-field">
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration (e.g. 6 months)"
                    value={form.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="manage-courses-form-field">
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                />
              </div>

              <div className="manage-courses-form-field manage-courses-file-input-wrapper">
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <div className="manage-courses-file-input-display">
                  <span>{fileName || "Upload Course Image"}</span>
                </div>
              </div>

              <div className="manage-courses-form-actions">
                <button
                  type="submit"
                  className="manage-courses-btn-primary"
                  disabled={loading}
                >
                  {editingCourse ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="manage-courses-btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="manage-courses-list">
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="manage-courses-card">
                <div className="manage-courses-image-container">
                  {course.image ? (
                    <img
                      src={`${API_BASE}/Uploads/${course.image}`}
                      alt={course.name}
                      className="manage-courses-image"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDI4MCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiMyNjMyNDIiLz48cGF0aCBkPSJNMTQwIDkwTDEzMCAxMDBIMTBMOTAgNzBINzBMNTAgMTEwSDEzMEwxNDAgMTAwTDE1MCAxMTBIMjMwTDIxMC03MEgxOTBMMTcwIDEwMEwxNDAgOTBaIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iMTQwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0VFRUVFRSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q291cnNlIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                  ) : (
                    <div className="manage-courses-placeholder">
                      <BookIcon />
                    </div>
                  )}
                </div>

                <div className="manage-courses-content">
                  <h3>{course.name}</h3>
                  <div className="manage-courses-meta">
                    <span className={`manage-courses-meta-item manage-courses-faculty-${course.faculty.toLowerCase()}`}>
                      <BookIcon /> {course.faculty}
                    </span>
                    <span className="manage-courses-meta-item">
                      <ClockIcon /> {course.duration}
                    </span>
                  </div>
                  <p className="manage-courses-description">{course.description}</p>
                  {course.videos && course.videos.length > 0 && (
                    <div className="manage-courses-video-links">
                      <strong>Videos:</strong>
                      <ul>
                        {course.videos.map((v, idx) => (
                          <li key={idx}>
                            <a href={v} target="_blank" rel="noopener noreferrer">
                              <VideoIcon /> Video {idx + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="manage-courses-actions">
                    <button
                      className="manage-courses-edit-btn"
                      onClick={() => handleEdit(course)}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      className="manage-courses-delete-btn"
                      onClick={() => handleDelete(course._id)}
                    >
                      <DeleteIcon /> Delete
                    </button>
                    <button
                      className="manage-courses-questions-btn"
                      onClick={() => navigate(`/s/student/courses/${course._id}/questions`)}
                    >
                      <QuestionIcon /> Questions
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;