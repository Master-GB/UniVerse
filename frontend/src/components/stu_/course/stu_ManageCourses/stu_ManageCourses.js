import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './stu_ManageCourses.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/courses";

// Icon components (you can replace these with actual icon library)
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V4c0-1.11-.89-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const QuestionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

function ManageCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    faculty: '',
    description: '',
    level: 'Certificate Level',
    duration: '',
    image: null,
    videos: [],
    videosText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState('');

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/`);
      setCourses(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching courses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCourses(); 
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setFileName(file.name);
    }
  };

  // Handle videos input
  const handleVideosChange = (e) => {
    const text = e.target.value;
    setForm({ ...form, videosText: text, videos: text.split('\n').filter(v => v.trim() !== '') });
  };

  // Add / Update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.faculty || !form.duration) {
      setError('Faculty, Course Name, and Duration are required');
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
      formData.append("questionText", ""); // required by backend
      formData.append("answer", "");       // required by backend

      if (form.image) formData.append("image", form.image);
      if (form.videos.length > 0) formData.append("videos", JSON.stringify(form.videos));

      let res;
      if (editingCourse) {
        res = await axios.put(`${API_URL}/${editingCourse._id}`, formData);
        setSuccess('🎉 Course updated successfully!');
        setEditingCourse(null);
      } else {
        res = await axios.post(`${API_URL}/`, formData);
        setSuccess('✨ Course added successfully!');
      }

      setError('');
      resetForm();
      fetchCourses();

      // Redirect to Add Questions page after creating course
      if (!editingCourse && res?.data?.data?._id) {
        navigate(`/courses/${res.data.data._id}/add-questions`);
      }

    } catch (err) {
      setError('Error saving course: ' + (err.response?.data?.error || err.message));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: '',
      faculty: '',
      description: '',
      level: 'Certificate Level',
      duration: '',
      image: null,
      videos: [],
      videosText: ''
    });
    setFileName('');
    setShowForm(false);
  };

  // Delete course
  const handleDelete = async (id, courseName) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('🗑️ Course deleted successfully!');
      setError('');
      fetchCourses();
    } catch (err) {
      setError('Error deleting course: ' + (err.response?.data?.error || err.message));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Edit course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.coursename,
      faculty: course.faculty,
      description: course.description,
      level: course.level,
      duration: course.duration,
      image: null,
      videos: course.videos || [],
      videosText: (course.videos || []).join('\n')
    });
    setFileName('');
    setShowForm(true);
    // Scroll to form
    document.querySelector('.form-card-ManageCourses')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get faculty-specific styling
  const getFacultyClass = (faculty) => {
    switch(faculty) {
      case 'Computing': return 'faculty-computing';
      case 'Business': return 'faculty-business';
      case 'Engineering': return 'faculty-engineering';
      default: return '';
    }
  };

  // Statistics
  const stats = {
    total: courses.length,
    computing: courses.filter(c => c.faculty === 'Computing').length,
    business: courses.filter(c => c.faculty === 'Business').length,
    engineering: courses.filter(c => c.faculty === 'Engineering').length
  };

  return (
    <div className="all-courses-page">
      <div className="container-ManageCourses">
        {/* Header */}
        <h1>Course Management Hub</h1>
        <p className="page-subtitle">
          Create, manage, and organize your educational content with modern tools
        </p>

        {/* Statistics Cards */}
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.computing}</div>
            <div className="stat-label">Computing</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.business}</div>
            <div className="stat-label">Business</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.engineering}</div>
            <div className="stat-label">Engineering</div>
          </div>
        </div>

        {/* Alerts */}
        {success && <div className="success-ManageCourses">{success}</div>}
        {error && <div className="error-ManageCourses">{error}</div>}
        {loading && <div className="loading-ManageCourses">Processing your request...</div>}

        {/* Add Course Button */}
        {!showForm && !editingCourse && (
          <button 
            className="add-course-btn" 
            onClick={() => setShowForm(true)}
          >
            <PlusIcon />
            Add New Course
          </button>
        )}

        {/* Form Card */}
        {(showForm || editingCourse) && (
          <div className="form-card-ManageCourses">
            <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-grid">
                <div className="form-field">
                  <select 
                    name="faculty" 
                    value={form.faculty} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Computing">Computing </option>
                    <option value="Business">Business </option>
                    <option value="Engineering">Engineering </option>
                  </select>
                </div>

                <div className="form-field">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Course Name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-field">
                  <input 
                    type="text" 
                    name="duration" 
                    placeholder="Duration (e.g., 2-3 hours)" 
                    value={form.duration} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-field">
                  <input 
                    type="text" 
                    value="Certificate Level" 
                    readOnly 
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-field">
                <textarea 
                  name="description" 
                  placeholder="Course Description - Describe what students will learn..." 
                  value={form.description} 
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-field">
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <div className="file-input-display">
                    <UploadIcon />
                    {fileName ? fileName : 'Choose course image (optional)'}
                  </div>
                </div>
              </div>

              <div className="form-field">
                <textarea
                  name="videos"
                  placeholder="Enter video links (one per line)&#10;https://youtube.com/watch?v=example1&#10;https://youtube.com/watch?v=example2"
                  value={form.videosText}
                  onChange={handleVideosChange}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  <CancelIcon />
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <SaveIcon />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Course List */}
        <div className="course-list-ManageCourses">
          {loading && courses.length === 0 ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="course-card-skeleton skeleton"></div>
            ))
          ) : (
            courses.map(course => (
              <div key={course._id} className="course-card-ManageCourses">
                <div className="course-image-container">
                  {course.image ? (
                    <>
                      <img
                        src={`${API_URL.replace('/api/courses', '')}/uploads/${course.image}`}
                        alt={course.coursename}
                        className="course-img-ManageCourses"
                      />
                      <div className="course-image-overlay">
                        <VideoIcon />
                      </div>
                    </>
                  ) : (
                    <div className="course-placeholder">
                      <BookIcon />
                    </div>
                  )}
                </div>

                <div className="course-content">
                  <div className="course-header">
                    <h3>{course.coursename}</h3>
                    
                    <div className="course-meta">
                      <div className={`meta-item ${getFacultyClass(course.faculty)}`}>
                        <BookIcon />
                        {course.faculty}
                      </div>
                      <div className="meta-item">
                        <ClockIcon />
                        {course.duration}
                      </div>
                    </div>
                  </div>

                  {course.description && (
                    <p className="course-description">{course.description}</p>
                  )}

                  {course.videos && course.videos.length > 0 && (
                    <div className="video-links-ManageCourses">
                      <b>📹 Course Videos ({course.videos.length})</b>
                      <ul>
                        {course.videos.map((video, idx) => (
                          <li key={idx}>
                            <a href={video} target="_blank" rel="noreferrer">
                              Video {idx + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="course-actions-ManageCourses">
                    <button 
                      className="edit-btn-ManageCourses" 
                      onClick={() => handleEdit(course)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button 
                      className="delete-btn-ManageCourses" 
                      onClick={() => handleDelete(course._id, course.coursename)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                    <button 
                      className="add-questions-btn-ManageCourses" 
                      onClick={() => navigate(`/courses/${course._id}/add-questions`)}
                    >
                      <QuestionIcon />
                      Questions
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#8892b0',
            fontSize: '1.1rem'
          }}>
            <BookIcon />
            <p style={{ margin: '20px 0' }}>No courses found. Create your first course to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCourses;