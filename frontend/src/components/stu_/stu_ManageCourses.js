import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stu_ManageCourses.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    faculty: '',
    description: '',
    level: 'Certificate Level',
    duration: '1-2 hours',
    image: null,
    content: [],
    contentText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/courses`);
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

  // Handle content input (split pages by ---)
  const handleContentChange = (e) => {
    const text = e.target.value;
    setForm({ ...form, contentText: text, content: text.split('---') });
  };

  // Add / Update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.faculty) {
      setError('Faculty and Course Name are required');
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
      if (form.content.length > 0) formData.append("content", JSON.stringify(form.content));

      if (editingCourse) {
        await axios.put(`${API_URL}/api/courses/${editingCourse._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess('Course updated successfully');
        setEditingCourse(null);
      } else {
        await axios.post(`${API_URL}/api/courses`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess('Course added successfully');
      }

      setError('');
      setForm({
        name: '',
        faculty: '',
        description: '',
        level: 'Certificate Level',
        duration: '1-2 hours',
        image: null,
        content: [],
        contentText: ''
      });
      fetchCourses();
    } catch (err) {
      setError('Error saving course: ' + err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`);
      setSuccess('Course deleted successfully');
      setError('');
      fetchCourses();
    } catch (err) {
      setError('Error deleting course: ' + err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Edit course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.name,
      faculty: course.faculty,
      description: course.description,
      level: course.level,
      duration: course.duration,
      image: null,
      content: course.content || [],
      contentText: (course.content || []).join('---')
    });
  };

  return (
    <div className="container">
      <h1>Manage Courses</h1>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {/* Add / Edit Form */}
      <div className="form-card">
        <h2>{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          {/* Faculty Dropdown on top */}
          <select name="faculty" value={form.faculty} onChange={handleChange} required>
            <option value="">Select Faculty</option>
            <option value="Computing">Computing</option>
            <option value="Business">Business</option>
            <option value="Medicine">Medicine</option>
            <option value="Engineering">Engineering</option>
          </select>

          {/* Course Name */}
          <input type="text" name="name" placeholder="Course Name" value={form.name} onChange={handleChange} required />

          {/* Description */}
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea>

          {/* Level & Duration - read-only */}
          <input type="text" value="Certificate Level" readOnly />
          <input type="text" value="1–2 hours" readOnly />

          {/* Image */}
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

          {/* Content */}
          <textarea
            name="content"
            placeholder="Enter course content (separate pages using ---)"
            value={form.contentText}
            onChange={handleContentChange}
            style={{ height: '120px' }}
          ></textarea>

          <button type="submit">{editingCourse ? 'Update Course' : 'Add Course'}</button>
        </form>
      </div>

      {/* Course List */}
      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            {course.image && (
              <img
                src={`${API_URL}/uploads/${course.image}`}
                // debugging with hardcoded image URL
                //src="http://localhost:8070/uploads/1756112439631-testInputImage.png"
                alt={course.name}
                className="course-img"
              />
            )}
            <h3>{course.name}</h3>
            <p><b>Faculty:</b> {course.faculty}</p>
            <p><b>Level:</b> {course.level}</p>
            <p><b>Duration:</b> {course.duration}</p>
            <p>{course.description}</p>
            <div className="course-actions">
              <button className="edit-btn" onClick={() => handleEdit(course)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(course._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCourses;
