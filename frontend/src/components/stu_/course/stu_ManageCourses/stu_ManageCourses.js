import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './stu_ManageCourses.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/courses";

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

  useEffect(() => { fetchCourses(); }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
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
        // Update existing course
        // don't set Content-Type manually; browser will add boundary
  res = await axios.put(`${API_URL}/${editingCourse._id}`, formData);
        setSuccess('Course updated successfully');
        setEditingCourse(null);
      } else {
        // Create new course
        // don't set Content-Type manually; browser will add boundary
        res = await axios.post(`${API_URL}/`, formData);
        setSuccess('Course added successfully');
      }

      setError('');
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

  // Delete course
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('Course deleted successfully');
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
  };

  return (

    <div className="all-courses-page">
      <div className="container-ManageCourses">
        <h1>Manage Courses</h1>
        {success && <p className="success-ManageCourses">{success}</p>}
        {error && <p className="error-ManageCourses">{error}</p>}
        {loading && <p className="loading-ManageCourses">Loading...</p>}
        <div className="form-card-ManageCourses">
          <h2>{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <select name="faculty" value={form.faculty} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Computing">Computing</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
            </select>
            <input type="text" name="name" placeholder="Course Name" value={form.name} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea>
            <input type="text" value="Certificate Level" readOnly />
            <input type="text" name="duration" placeholder="Duration (e.g. 1–2 hours)" value={form.duration} onChange={handleChange} required />
            <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
            <textarea
              name="videos"
              placeholder="Enter video links (one per line)"
              value={form.videosText}
              onChange={handleVideosChange}
              style={{ height: '120px' }}
            ></textarea>
            <button type="submit">{editingCourse ? 'Update Course' : 'Add Course'}</button>
          </form>
        </div>
        <div className="course-list-ManageCourses">
          {courses.map(course => (
            <div key={course._id} className="course-card-ManageCourses">
              {course.image && (
                <img
                  src={`${API_URL.replace('/api/courses', '')}/uploads/${course.image}`}
                  alt={course.coursename}
                  className="course-img-ManageCourses"
                />
              )}
              <h3>{course.coursename}</h3>
              <p><b>Faculty:</b> {course.faculty}</p>
              <p><b>Level:</b> {course.level}</p>
              <p><b>Duration:</b> {course.duration}</p>
              <p>{course.description}</p>
              {course.videos && course.videos.length > 0 && (
                <div className="video-links-ManageCourses">
                  <b>Videos:</b>
                  <ul>
                    {course.videos.map((v, idx) => (
                      <li key={idx}><a href={v} target="_blank" rel="noreferrer">{v}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="course-actions-ManageCourses">
                <button className="edit-btn-ManageCourses" onClick={() => handleEdit(course)}>Edit</button>
                <button className="delete-btn-ManageCourses" onClick={() => handleDelete(course._id)}>Delete</button>
                {!editingCourse && (
                  <button className="add-questions-btn-ManageCourses" onClick={() => navigate(`/courses/${course._id}/add-questions`)}>
                    Add Questions
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;