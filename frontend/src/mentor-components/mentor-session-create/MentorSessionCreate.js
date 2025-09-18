import React, { useState } from 'react';
import './MentorSessionCreate.css';
import Navbar from '../mentor-navbar/MentorNavbar';

const MentorSessionCreate = () => {
  const [formData, setFormData] = useState({
    mentor_name: '',
    mentor_description: '',
    mentor_email: '',
    session_start_date: '',
    session_start_time: '',
    session_title: '',
    session_duration: '',
    seat_count: 1,
    session_status: 'book',
    session_description: '',
    session_link: '',
    resource_links: [], // <-- new field
    session_resources: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [currentResourceLink, setCurrentResourceLink] = useState(''); // New state for current resource link input

  const API_BASE_URL = 'http://localhost:8070';

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'session_resources') {
      setFormData(prev => ({
        ...prev,
        [name]: files
      }));
      setUploadComplete(false);
      simulateUpload();
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        session_resources: e.dataTransfer.files
      }));
      setUploadComplete(false);
      simulateUpload();
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.mentor_name.trim()) newErrors.mentor_name = 'Mentor name is required';
      if (!formData.mentor_email.trim()) {
        newErrors.mentor_email = 'Mentor email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.mentor_email)) {
        newErrors.mentor_email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      if (!formData.session_title.trim()) newErrors.session_title = 'Session title is required';
      if (!formData.session_description.trim()) newErrors.session_description = 'Session description is required';
      if (!formData.session_start_date) newErrors.session_start_date = 'Session start date is required';
      if (!formData.session_start_time) newErrors.session_start_time = 'Session start time is required';
      if (!formData.session_duration.trim()) newErrors.session_duration = 'Session duration is required';
    } else if (step === 3) {
      if (!formData.session_link.trim()) {
        newErrors.session_link = 'Session link is required';
      } else if (!/^https?:\/\/.+/.test(formData.session_link)) {
        newErrors.session_link = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'session_resources' && formData[key]) {
          for (let i = 0; i < formData[key].length; i++) {
            submitData.append('session_resources', formData[key][i]);
          }
        } else if (key === 'resource_links' && formData[key].length > 0) {
          formData[key].forEach(link => submitData.append('resource_links', link));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/mentorshipResponse/add`, {
        method: 'POST',
        body: submitData
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to create session");
      }

      console.log('✅ Session created successfully:', result);
      alert('🎉 Session created successfully!');

      setFormData({
        mentor_name: '',
        mentor_description: '',
        mentor_email: '',
        session_start_date: '',
        session_start_time: '',
        session_title: '',
        session_duration: '',
        seat_count: 1,
        session_status: 'book',
        session_description: '',
        session_link: '',
        resource_links: [], // <-- reset resource links
        session_resources: null,
      });
      setCurrentStep(1);
      setUploadComplete(false);
    } catch (error) {
      console.error('❌ Error creating session:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (step) => {
    if (step < currentStep) return '✅';
    if (step === currentStep) return step;
    return step;
  };

  // Handler to add a resource link
  const handleAddResourceLink = () => {
    if (currentResourceLink.trim() && /^https?:\/\/.+/.test(currentResourceLink)) {
      setFormData(prev => ({
        ...prev,
        resource_links: [...prev.resource_links, currentResourceLink.trim()]
      }));
      setCurrentResourceLink('');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="session-creator-md">
        <div className="creator-header-md">
      
        </div>
        <div className="creator-body-md">
          <div className="progress-sidebar-md">
            <div className="progress-header-md">
              <h3>Create Session</h3>
              <p>Let's build something amazing together</p>
            </div>
      
            <div className="step-progress-md">
              <div className={`step-item-md ${currentStep >= 1 ? 'active-md' : ''} ${currentStep > 1 ? 'completed-md' : ''}`}>
                <div className="step-circle-md">{getStepIcon(1)}</div>
                <div className="step-content-md">
                  <div className="step-title-md">Basic Info</div>
                  <div className="step-desc-md">Mentor & Category details</div>
                </div>
              </div>
      
              <div className={`step-item-md ${currentStep >= 2 ? 'active-md' : ''} ${currentStep > 2 ? 'completed-md' : ''}`}>
                <div className="step-circle-md">{getStepIcon(2)}</div>
                <div className="step-content-md">
                  <div className="step-title-md">Session Details</div>
                  <div className="step-desc-md">Title, description & settings</div>
                </div>
              </div>
      
              <div className={`step-item-md ${currentStep >= 3 ? 'active-md' : ''}`}>
                <div className="step-circle-md">{getStepIcon(3)}</div>
                <div className="step-content-md">
                  <div className="step-title-md">Resources & Link</div>
                  <div className="step-desc-md">Upload materials & session link</div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-container-md">
            {Object.keys(errors).length > 0 && (
              <div className="error-summary-md" role="alert" aria-live="assertive">
                <h4>Please fix the following errors:</h4>
                <ul>
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
      
            <div className="form-scroll-md">
              {currentStep === 1 && (
                <div className="form-step-md">
                  <div className="step-header-md">
                    <h2>👋 Let's start Create Session</h2>
                    <p>Tell us about yourself and what you'll be mentoring</p>
                  </div>
                  <div className="form-grid-md">
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="mentor_name">
                        <span>Mentor Name</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="mentor_name"
                        type="text"
                        name="mentor_name"
                        value={formData.mentor_name}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.mentor_name ? 'error-md' : ''}`}
                        placeholder="Your full name"
                        aria-required="true"
                        aria-describedby={errors.mentor_name ? 'mentor_name_error' : undefined}
                      />
                      {errors.mentor_name && (
                        <span id="mentor_name_error" className="error-text-md">{errors.mentor_name}</span>
                      )}
                    </div>
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="mentor_email">
                        <span>Email Address</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="mentor_email"
                        type="email"
                        name="mentor_email"
                        value={formData.mentor_email}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.mentor_email ? 'error-md' : ''}`}
                        placeholder="your.email@example.com"
                        aria-required="true"
                        aria-describedby={errors.mentor_email ? 'mentor_email_error' : undefined}
                      />
                      {errors.mentor_email && (
                        <span id="mentor_email_error" className="error-text-md">{errors.mentor_email}</span>
                      )}
                    </div>
                    <div className="input-group-md full-width-md">
                      <label className="input-label-md" htmlFor="mentor_description">About You</label>
                      <textarea
                        id="mentor_description"
                        name="mentor_description"
                        value={formData.mentor_description}
                        onChange={handleInputChange}
                        className="modern-textarea-md"
                        placeholder="Brief description about your expertise and background..."
                        rows="4"
                        aria-describedby="mentor_description_hint"
                      />
                      <span id="mentor_description_hint" className="input-hint-md">
                        Share your expertise and background to attract participants.
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="form-step-md">
                  <div className="step-header-md">
                    <h2>📚 Session Configuration</h2>
                    <p>Define your session content and structure</p>
                  </div>
                  <div className="form-grid-md">
                    <div className="input-group-md full-width-md">
                      <label className="input-label-md" htmlFor="session_title">
                        <span>Session Title</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="session_title"
                        type="text"
                        name="session_title"
                        value={formData.session_title}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.session_title ? 'error-md' : ''}`}
                        placeholder="e.g., Advanced React Patterns & Best Practices"
                        aria-required="true"
                        aria-describedby={errors.session_title ? 'session_title_error' : undefined}
                      />
                      {errors.session_title && (
                        <span id="session_title_error" className="error-text-md">{errors.session_title}</span>
                      )}
                    </div>
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="session_start_date">
                        <span>Session Start Date</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="session_start_date"
                        type="date"
                        name="session_start_date"
                        value={formData.session_start_date || ""}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.session_start_date ? 'error-md' : ''}`}
                        min={new Date().toISOString().split("T")[0]}
                        aria-required="true"
                        aria-describedby={errors.session_start_date ? 'session_start_date_error' : undefined}
                      />
                      {errors.session_start_date && (
                        <span id="session_start_date_error" className="error-text-md">{errors.session_start_date}</span>
                      )}
                    </div>
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="session_start_time">
                        <span>Session Start Time</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="session_start_time"
                        type="time"
                        name="session_start_time"
                        value={formData.session_start_time || ""}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.session_start_time ? 'error-md' : ''}`}
                        aria-required="true"
                        aria-describedby={errors.session_start_time ? 'session_start_time_error' : undefined}
                      />
                      {errors.session_start_time && (
                        <span id="session_start_time_error" className="error-text-md">{errors.session_start_time}</span>
                      )}
                    </div>
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="session_duration">
                        <span>Session Duration</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="session_duration"
                        type="text"
                        name="session_duration"
                        value={formData.session_duration}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.session_duration ? 'error-md' : ''}`}
                        placeholder="e.g., 1 hour, 30 minutes"
                        aria-required="true"
                        aria-describedby={errors.session_duration ? 'session_duration_error' : undefined}
                      />
                      {errors.session_duration && (
                        <span id="session_duration_error" className="error-text-md">{errors.session_duration}</span>
                      )}
                    </div>
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="seat_count">
                        <span>Seat Count</span>
                      </label>
                      <input
                        id="seat_count"
                        type="number"
                        name="seat_count"
                        value={formData.seat_count}
                        onChange={handleInputChange}
                        className="modern-input-md"
                        min="1"
                        max="100"
                        aria-describedby="seat_count_hint"
                      />
                      <span id="seat_count_hint" className="input-hint-md">
                        Number of participants (1-100).
                      </span>
                    </div>
                    <div className="input-group-md">
                      <label className="input-label-md" htmlFor="session_status">
                        <span>Session Status</span>
                      </label>
                      <select
                        id="session_status"
                        name="session_status"
                        value={formData.session_status}
                        onChange={handleInputChange}
                        className="modern-select-md"
                        aria-describedby="session_status_hint"
                      >
                        <option value="book">book</option>
                        <option value="booked">booked</option>
                      </select>
                      <span id="session_status_hint" className="input-hint-md">
                        Set the booking status for this session.
                      </span>
                    </div>
                    <div className="input-group-md full-width-md">
                      <label className="input-label-md" htmlFor="session_description">
                        <span>Session Description</span>
                        <span className="required-md">*</span>
                      </label>
                      <textarea
                        id="session_description"
                        name="session_description"
                        value={formData.session_description}
                        onChange={handleInputChange}
                        className={`modern-textarea-md ${errors.session_description ? 'error-md' : ''}`}
                        placeholder="Describe what participants will learn, the topics you'll cover, and any prerequisites..."
                        rows="5"
                        aria-required="true"
                        aria-describedby={errors.session_description ? 'session_description_error' : undefined}
                      />
                      {errors.session_description && (
                        <span id="session_description_error" className="error-text-md">{errors.session_description}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="form-step-md">
                  <div className="step-header-md">
                    <h2>🔗 Session Resources</h2>
                    <p>Add your meeting link and upload supporting materials</p>
                  </div>
                  <div className="form-grid-md">
                    {/* Session Link input - keep this separate */}
                    <div className="input-group-md full-width-md">
                      <label className="input-label-md" htmlFor="session_link">
                        <span>Session Link</span>
                        <span className="required-md">*</span>
                      </label>
                      <input
                        id="session_link"
                        type="url"
                        name="session_link"
                        value={formData.session_link}
                        onChange={handleInputChange}
                        className={`modern-input-md ${errors.session_link ? 'error-md' : ''}`}
                        placeholder="https://meet.google.com/your-meeting-link"
                        aria-required="true"
                        aria-describedby={errors.session_link ? 'session_link_error' : undefined}
                      />
                      {errors.session_link && (
                        <span id="session_link_error" className="error-text-md">{errors.session_link}</span>
                      )}
                    </div>
                    {/* Resource links input - new section */}
                    <div className="input-group-md full-width-md">
                      <label className="input-label-md" htmlFor="resource_links">
                        <span>Resource Links</span>
                      </label>
                      <div className="resource-links-container-md">
                        <input
                          type="url"
                          name="resource_link"
                          value={currentResourceLink}
                          onChange={(e) => setCurrentResourceLink(e.target.value)}
                          className="modern-input-md"
                          placeholder="https://example.com/resource"
                          aria-describedby="resource_link_hint"
                        />
                        <button
                          type="button"
                          onClick={handleAddResourceLink}
                          className="btn-md btn-secondary-md add-resource-link-md"
                          disabled={!currentResourceLink.trim()}
                          aria-label="Add resource link"
                        >
                          +
                        </button>
                      </div>
                      <span id="resource_link_hint" className="input-hint-md">
                        Add any additional links related to the session (e.g., slides, documents).
                      </span>
                      {formData.resource_links.length > 0 && (
                        <div className="added-resource-links-md">
                          <h4>Added Resource Links:</h4>
                          <ul>
                            {formData.resource_links.map((link, idx) => (
                              <li key={idx} className="resource-link-item-md">
                                <a href={link} target="_blank" rel="noopener noreferrer" className="resource-link-md">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {/* File upload area - keep this separate */}
                    <div className="input-group-md full-width-md">
                      <label className="input-label-md" htmlFor="session_resources">Session Resources</label>
                      <div
                        className={`file-upload-area-md ${dragActive ? 'drag-active-md' : ''} ${uploadComplete ? 'upload-complete-md' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            document.getElementById('session_resources').click();
                          }
                        }}
                        aria-describedby="file_upload_hint"
                      >
                        <div className="upload-icon-md">{uploadComplete ? '✅' : '📁'}</div>
                        <div className="upload-text-md">
                          <strong>Drag & drop files here</strong>
                          <span>or click to browse</span>
                        </div>
                        <input
                          id="session_resources"
                          type="file"
                          name="session_resources"
                          onChange={handleInputChange}
                          className="file-input-md"
                          multiple
                          aria-describedby="file_upload_hint"
                        />
                        {formData.session_resources && (
                          <div className="uploaded-file-md">
                            {Array.from(formData.session_resources).map((file, idx) => (
                              <span key={idx}>📄 {file.name}</span>
                            ))}
                            {!uploadComplete && (
                              <div className="upload-progress-md">
                                <div className="progress-bar-md" style={{ width: `${uploadProgress}%` }}></div>
                              </div>
                            )}
                            {uploadComplete && (
                              <span className="upload-success-md">Files uploaded successfully!</span>
                            )}
                          </div>
                        )}
                      </div>
                      <span id="file_upload_hint" className="file-info-md">
                        Supported formats: PDF, DOC, PPT, TXT, ZIP (Max: 10MB)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-actions-md">
              <div className="action-buttons-md">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-md btn-secondary-md"
                    aria-label="Go to previous step"
                  >
                    ← Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-md btn-primary-md"
                    aria-label="Go to next step"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn-md btn-success-md"
                    disabled={isSubmitting}
                    aria-label="Create session"
                    aria-disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-md"></div>
                        Creating Session...
                      </>
                    ) : (
                      '🚀 Create Session'
                    )}
                  </button>
                )}
              </div>
              <div className="progress-indicator-md" aria-live="polite">
                Step {currentStep} of 3
              </div>
            </div>
          </div>
        </div>
        {isSubmitting && (
          <div className="loading-overlay-md">
            <div className="spinner-md large-spinner-md"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorSessionCreate;