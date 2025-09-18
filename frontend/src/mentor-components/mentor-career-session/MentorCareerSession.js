import React, { useState, useEffect } from 'react';
import './MentorCareerSession.css';
import MentorNavbar from '../mentor-navbar/MentorNavbar';

const CareerSessionForm = () => {
  // Configure your backend URL here
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';
  
  const [formData, setFormData] = useState({
    mentor_name: '',
    mentor_description: '',
    mentor_email: '',
    session_start_date: '',
    session_start_time: '',
    session_status: 'book',
    seat_count: 1,
    session_duration: '',
    session_title: '',
    session_description: '',
    session_link: '',
    resource_links: [''],
    session_resources: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // useEffect to handle API submission when form is validated and ready
  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length === 0) {
      submitToAPI();
    }
  }, [isSubmitting, errors]);

  const submitToAPI = async () => {
    try {
      // Filter out empty resource links
      const cleanedData = {
        ...formData,
        resource_links: formData.resource_links.filter(link => link.trim() !== '')
      };

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Append all form fields except files
      Object.keys(cleanedData).forEach(key => {
        if (key === 'session_resources') {
          // Handle files separately
          cleanedData[key].forEach((file, index) => {
            formDataToSend.append(`session_resources`, file.buffer || file);
          });
        } else if (key === 'resource_links') {
          // Handle array of links
          cleanedData[key].forEach((link, index) => {
            formDataToSend.append(`resource_links[${index}]`, link);
          });
        } else {
          formDataToSend.append(key, cleanedData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/mentor-career-session/add`, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header when using FormData - browser will set it automatically with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert('Error creating career session. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      mentor_name: '',
      mentor_description: '',
      mentor_email: '',
      session_start_date: '',
      session_start_time: '',
      session_status: 'book',
      seat_count: 1,
      session_duration: '',
      session_title: '',
      session_description: '',
      session_link: '',
      resource_links: [''],
      session_resources: []
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleResourceLinkChange = (index, value) => {
    const newResourceLinks = [...formData.resource_links];
    newResourceLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      resource_links: newResourceLinks
    }));
  };

  const addResourceLink = () => {
    setFormData(prev => ({
      ...prev,
      resource_links: [...prev.resource_links, '']
    }));
  };

  const removeResourceLink = (index) => {
    if (formData.resource_links.length > 1) {
      const newResourceLinks = formData.resource_links.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        resource_links: newResourceLinks
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      filename: file.name,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      buffer: file // The actual file object for FormData
    }));
    
    setFormData(prev => ({
      ...prev,
      session_resources: [...prev.session_resources, ...fileData]
    }));
  };

  const removeFile = (index) => {
    const newFiles = formData.session_resources.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      session_resources: newFiles
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.mentor_name.trim()) newErrors.mentor_name = 'Mentor name is required';
    if (!formData.mentor_email.trim()) newErrors.mentor_email = 'Mentor email is required';
    if (!formData.session_start_date) newErrors.session_start_date = 'Session start date is required';
    if (!formData.session_start_time) newErrors.session_start_time = 'Session start time is required';
    if (!formData.session_duration.trim()) newErrors.session_duration = 'Session duration is required';
    if (!formData.session_title.trim()) newErrors.session_title = 'Session title is required';
    if (!formData.session_description.trim()) newErrors.session_description = 'Session description is required';
    if (!formData.session_link.trim()) newErrors.session_link = 'Session link is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.mentor_email && !emailRegex.test(formData.mentor_email)) {
      newErrors.mentor_email = 'Please enter a valid email address';
    }
    
    // URL validation for session link
    try {
      if (formData.session_link && !formData.session_link.startsWith('http')) {
        newErrors.session_link = 'Session link must be a valid URL (starting with http or https)';
      }
    } catch (error) {
      newErrors.session_link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // The actual submission will be handled by useEffect
    }
  };

  return (
    <div>
      <MentorNavbar/>
      {submitSuccess && (
        <div className="success-message">
          Career Session created successfully!
        </div>
      )}
      <div className="form-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h1>Create Career Session</h1>
            <p>Set up your mentoring session with all the necessary details</p>
          </div>
          <form onSubmit={handleSubmit} className="career-session-form">
            {/* Mentor Information Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">👨‍🏫</span>
                Mentor Information
              </h2>
    
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mentor_name">Mentor Name *</label>
                  <input
                    type="text"
                    id="mentor_name"
                    name="mentor_name"
                    value={formData.mentor_name}
                    onChange={handleInputChange}
                    className={errors.mentor_name ? 'error' : ''}
                    placeholder="Enter mentor's full name"
                    disabled={isSubmitting}
                  />
                  {errors.mentor_name && <span className="error-message">{errors.mentor_name}</span>}
                </div>
    
                <div className="form-group">
                  <label htmlFor="mentor_email">Mentor Email *</label>
                  <input
                    type="email"
                    id="mentor_email"
                    name="mentor_email"
                    value={formData.mentor_email}
                    onChange={handleInputChange}
                    className={errors.mentor_email ? 'error' : ''}
                    placeholder="mentor@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.mentor_email && <span className="error-message">{errors.mentor_email}</span>}
                </div>
              </div>
    
              <div className="form-group">
                <label htmlFor="mentor_description">Mentor Description</label>
                <textarea
                  id="mentor_description"
                  name="mentor_description"
                  value={formData.mentor_description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description about the mentor's background and expertise"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {/* Session Details Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">📅</span>
                Session Details
              </h2>
    
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="session_start_date">Start Date *</label>
                  <input
                    type="date"
                    id="session_start_date"
                    name="session_start_date"
                    value={formData.session_start_date}
                    onChange={handleInputChange}
                    className={errors.session_start_date ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.session_start_date && <span className="error-message">{errors.session_start_date}</span>}
                </div>
    
                <div className="form-group">
                  <label htmlFor="session_start_time">Start Time *</label>
                  <input
                    type="time"
                    id="session_start_time"
                    name="session_start_time"
                    value={formData.session_start_time}
                    onChange={handleInputChange}
                    className={errors.session_start_time ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.session_start_time && <span className="error-message">{errors.session_start_time}</span>}
                </div>
              </div>
    
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="session_duration">Duration *</label>
                  <select
                    id="session_duration"
                    name="session_duration"
                    value={formData.session_duration}
                    onChange={handleInputChange}
                    className={errors.session_duration ? 'error' : ''}
                    disabled={isSubmitting}
                  >
                    <option value="">Select duration</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                  {errors.session_duration && <span className="error-message">{errors.session_duration}</span>}
                </div>
    
                <div className="form-group">
                  <label htmlFor="seat_count">Available Seats</label>
                  <input
                    type="number"
                    id="seat_count"
                    name="seat_count"
                    value={formData.seat_count}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
    
              <div className="form-group">
                <label htmlFor="session_status">Session Status</label>
                <select
                  id="session_status"
                  name="session_status"
                  value={formData.session_status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="book">Available to Book</option>
                  <option value="booked">Already Booked</option>
                </select>
              </div>
            </div>
            {/* Session Content Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">📝</span>
                Session Content
              </h2>
    
              <div className="form-group">
                <label htmlFor="session_title">Session Title *</label>
                <input
                  type="text"
                  id="session_title"
                  name="session_title"
                  value={formData.session_title}
                  onChange={handleInputChange}
                  className={errors.session_title ? 'error' : ''}
                  placeholder="Enter a compelling session title"
                  disabled={isSubmitting}
                />
                {errors.session_title && <span className="error-message">{errors.session_title}</span>}
              </div>
    
              <div className="form-group">
                <label htmlFor="session_description">Session Description *</label>
                <textarea
                  id="session_description"
                  name="session_description"
                  value={formData.session_description}
                  onChange={handleInputChange}
                  className={errors.session_description ? 'error' : ''}
                  rows="4"
                  placeholder="Detailed description of what will be covered in this session"
                  disabled={isSubmitting}
                />
                {errors.session_description && <span className="error-message">{errors.session_description}</span>}
              </div>
    
              <div className="form-group">
                <label htmlFor="session_link">Session Link *</label>
                <input
                  type="url"
                  id="session_link"
                  name="session_link"
                  value={formData.session_link}
                  onChange={handleInputChange}
                  className={errors.session_link ? 'error' : ''}
                  placeholder="https://meet.google.com/xxx-xxx-xxx"
                  disabled={isSubmitting}
                />
                {errors.session_link && <span className="error-message">{errors.session_link}</span>}
              </div>
            </div>
            {/* Resources Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">📚</span>
                Resources
              </h2>
    
              <div className="form-group">
                <label>Resource Links</label>
                {formData.resource_links.map((link, index) => (
                  <div key={index} className="resource-link-row">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleResourceLinkChange(index, e.target.value)}
                      placeholder="https://example.com/resource"
                      disabled={isSubmitting}
                    />
                    {formData.resource_links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResourceLink(index)}
                        className="remove-btn"
                        disabled={isSubmitting}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addResourceLink} 
                  className="add-btn"
                  disabled={isSubmitting}
                >
                  + Add Resource Link
                </button>
              </div>
    
              <div className="form-group">
                <label htmlFor="session_resources">Upload Files</label>
                <input
                  type="file"
                  id="session_resources"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  disabled={isSubmitting}
                />
                {formData.session_resources.length > 0 && (
                  <div className="uploaded-files">
                    {formData.session_resources.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.originalName}</span>
                        <span className="file-size">({Math.round(file.size / 1024)}KB)</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="remove-file-btn"
                          disabled={isSubmitting}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Career Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerSessionForm;