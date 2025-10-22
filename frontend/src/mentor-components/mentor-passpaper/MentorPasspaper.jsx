import React, { useState } from 'react';
import './MentorPasspaper.css';
import Navbar from '../mentor-navbar/MentorNavbar';
import { FileText, Plus, X, Save } from 'lucide-react';

const MentorPasspaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    year: '1st Year',
    semester: '1st Semester',
    questions: '',
    timeAllowed: '',
    fileUrl: '',
    modelAnswersUrl: '',
    modelAnswers: false,
    difficulty: 'Medium',
    tags: [],
    department: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  // Year levels according to model
  const yearLevels = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/passpaper/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Past paper created successfully!' });
        setFormData({
          title: '',
          code: '',
          year: '1st Year',
          semester: '1st Semester',
          questions: '',
          timeAllowed: '',
          fileUrl: '',
          modelAnswersUrl: '',
          modelAnswers: false,
          difficulty: 'Medium',
          tags: [],
          department: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create past paper' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      code: '',
      year: '1st Year',
      semester: '1st Semester',
      questions: '',
      timeAllowed: '',
      fileUrl: '',
      modelAnswersUrl: '',
      modelAnswers: false,
      difficulty: 'Medium',
      tags: [],
      department: ''
    });
    setTagInput('');
    setMessage({ type: '', text: '' });
  };

  return (
    <div>
      <Navbar />
      <div className="a-m-pass-container">
        <div className="a-m-pass-card">
          <div className="a-m-pass-header">
            <div>
              <h1 className="a-m-pass-title">
                <FileText className="a-m-pass-title-icon" />
                Add Past Exam Paper
              </h1>
              <p className="a-m-pass-subtitle">Upload new past exam papers with model answers</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="a-m-pass-btn-reset"
            >
              <X size={20} />
              Reset Form
            </button>
          </div>

          {message.text && (
            <div className={`a-m-pass-message a-m-pass-message-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="a-m-pass-form">
            <div className="a-m-pass-section">
              <h2 className="a-m-pass-section-title">Paper Information</h2>
              
              <div className="a-m-pass-form-group">
                <label htmlFor="title" className="a-m-pass-label">
                  Paper Title <span className="a-m-pass-required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="a-m-pass-input"
                  placeholder="e.g., Software Engineering - Final Exam"
                  required
                />
              </div>

              <div className="a-m-pass-form-row">
                <div className="a-m-pass-form-group">
                  <label htmlFor="code" className="a-m-pass-label">
                    Course Code <span className="a-m-pass-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="a-m-pass-input"
                    placeholder="e.g., SE3080"
                    required
                  />
                </div>
                <div className="a-m-pass-form-group">
                  <label htmlFor="department" className="a-m-pass-label">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="a-m-pass-input"
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>

              <div className="a-m-pass-form-row">
                <div className="a-m-pass-form-group">
                  <label htmlFor="year" className="a-m-pass-label">
                    Year Level <span className="a-m-pass-required">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="a-m-pass-select"
                    required
                  >
                    {yearLevels.map(yearLevel => (
                      <option key={yearLevel} value={yearLevel}>{yearLevel}</option>
                    ))}
                  </select>
                </div>
                <div className="a-m-pass-form-group">
                  <label htmlFor="semester" className="a-m-pass-label">
                    Semester <span className="a-m-pass-required">*</span>
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="a-m-pass-select"
                    required
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer Semester">Summer Semester</option>
                  </select>
                </div>
              </div>

              <div className="a-m-pass-form-row">
                <div className="a-m-pass-form-group">
                  <label htmlFor="questions" className="a-m-pass-label">
                    Number of Questions <span className="a-m-pass-required">*</span>
                  </label>
                  <input
                    type="number"
                    id="questions"
                    name="questions"
                    value={formData.questions}
                    onChange={handleChange}
                    className="a-m-pass-input"
                    placeholder="e.g., 8"
                    min="1"
                    required
                  />
                </div>
                <div className="a-m-pass-form-group">
                  <label htmlFor="timeAllowed" className="a-m-pass-label">
                    Time Allowed <span className="a-m-pass-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="timeAllowed"
                    name="timeAllowed"
                    value={formData.timeAllowed}
                    onChange={handleChange}
                    className="a-m-pass-input"
                    placeholder="e.g., 3 Hours"
                    required
                  />
                </div>
              </div>

              <div className="a-m-pass-form-group">
                <label htmlFor="difficulty" className="a-m-pass-label">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="a-m-pass-select"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="a-m-pass-section">
              <h2 className="a-m-pass-section-title">File Links</h2>
              
              <div className="a-m-pass-form-group">
                <label htmlFor="fileUrl" className="a-m-pass-label">
                  Paper File URL <span className="a-m-pass-required">*</span>
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  className="a-m-pass-input"
                  placeholder="https://example.com/papers/se_2024.pdf"
                  required
                />
                <small className="a-m-pass-hint">Direct link to the PDF file</small>
              </div>

              <div className="a-m-pass-form-group">
                <div className="a-m-pass-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="modelAnswers"
                    name="modelAnswers"
                    checked={formData.modelAnswers}
                    onChange={handleChange}
                    className="a-m-pass-checkbox"
                  />
                  <label htmlFor="modelAnswers" className="a-m-pass-checkbox-label">
                    This paper has model answers
                  </label>
                </div>
              </div>

              {formData.modelAnswers && (
                <div className="a-m-pass-form-group a-m-pass-fade-in">
                  <label htmlFor="modelAnswersUrl" className="a-m-pass-label">
                    Model Answers File URL
                  </label>
                  <input
                    type="url"
                    id="modelAnswersUrl"
                    name="modelAnswersUrl"
                    value={formData.modelAnswersUrl}
                    onChange={handleChange}
                    className="a-m-pass-input"
                    placeholder="https://example.com/papers/se_2024_answers.pdf"
                  />
                  <small className="a-m-pass-hint">Direct link to the model answers PDF</small>
                </div>
              )}
            </div>

            <div className="a-m-pass-section">
              <h2 className="a-m-pass-section-title">Tags</h2>
              
              <div className="a-m-pass-form-group">
                <label htmlFor="tagInput" className="a-m-pass-label">
                  Add Tags
                </label>
                <div className="a-m-pass-tag-input-wrapper">
                  <input
                    type="text"
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="a-m-pass-input"
                    placeholder="Add tags (e.g., Final Exam, Midterm)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="a-m-pass-btn-add-tag"
                  >
                    <Plus size={18} />
                    Add Tag
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="a-m-pass-tags-container">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="a-m-pass-tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="a-m-pass-tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="a-m-pass-form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="a-m-pass-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="a-m-pass-btn-submit"
              >
                <Save size={20} />
                {isSubmitting ? 'Creating...' : 'Create Past Paper'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorPasspaper;