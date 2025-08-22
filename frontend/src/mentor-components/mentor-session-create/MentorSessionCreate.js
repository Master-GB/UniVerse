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
    session_description: '',
    session_link: '',
    session_resources: null,
    
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Backend API URL
  const API_BASE_URL = 'http://localhost:8070';

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'session_resources') {
      setFormData(prev => ({
        ...prev,
        [name]: files
      }));
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
      submitData.append('mentor_name', formData.mentor_name);
      submitData.append('mentor_description', formData.mentor_description || '');
      submitData.append('mentor_email', formData.mentor_email);
      submitData.append('session_start_date', formData.session_start_date);
      submitData.append('session_start_time', formData.session_start_time);
      submitData.append('session_title', formData.session_title);
      submitData.append('session_description', formData.session_description);
      submitData.append('session_link', formData.session_link);
      
      if (formData.session_resources && formData.session_resources.length > 0) {
        for (let i = 0; i < formData.session_resources.length; i++) {
          submitData.append('session_resources', formData.session_resources[i]);
        }
      }

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
        session_description: '',
        session_link: '',
        session_resources: null,
        
      });
      setCurrentStep(1);

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

  return (
    <div className="session-creator-md">
      <div className="creator-header-md">
        <Navbar />
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
          <div className="form-scroll-md">
            {currentStep === 1 && (
              <div className="form-step-md">
                <div className="step-header-md">
                  <h2>👋 Let's start Create Session</h2>
                  <p>Tell us about yourself and what you'll be mentoring</p>
                </div>

                <div className="form-grid-md">
                  <div className="input-group-md">
                    <label className="input-label-md">
                      <span>Mentor Name</span>
                      <span className="required-md">*</span>
                    </label>
                    <input
                      type="text"
                      name="mentor_name"
                      value={formData.mentor_name}
                      onChange={handleInputChange}
                      className={`modern-input-md ${errors.mentor_name ? 'error-md' : ''}`}
                      placeholder="Your full name"
                    />
                    {errors.mentor_name && <span className="error-text-md">{errors.mentor_name}</span>}
                  </div>

                  <div className="input-group-md">
                    <label className="input-label-md">
                      <span>Email Address</span>
                      <span className="required-md">*</span>
                    </label>
                    <input
                      type="email"
                      name="mentor_email"
                      value={formData.mentor_email}
                      onChange={handleInputChange}
                      className={`modern-input-md ${errors.mentor_email ? 'error-md' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.mentor_email && <span className="error-text-md">{errors.mentor_email}</span>}
                  </div>

                  <div className="input-group-md full-width-md">
                    <label className="input-label-md">About You</label>
                    <textarea
                      name="mentor_description"
                      value={formData.mentor_description}
                      onChange={handleInputChange}
                      className="modern-textarea-md"
                      placeholder="Brief description about your expertise and background..."
                      rows="4"
                    />
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
                    <label className="input-label-md">
                      <span>Session Title</span>
                      <span className="required-md">*</span>
                    </label>
                    <input
                      type="text"
                      name="session_title"
                      value={formData.session_title}
                      onChange={handleInputChange}
                      className={`modern-input-md ${errors.session_title ? 'error-md' : ''}`}
                      placeholder="e.g., Advanced React Patterns & Best Practices"
                    />
                    {errors.session_title && <span className="error-text-md">{errors.session_title}</span>}
                  </div>

                  <div className="input-group-md full-width-md">
                    <label className="input-label-md">
                      <span>Session Start Date</span>
                      <span className="required-md">*</span>
                    </label>
                    <input  
                      type="date"
                      name="session_start_date" 
                      value={formData.session_start_date || ""}
                      onChange={handleInputChange}
                      className={`modern-input-md ${errors.session_start_date ? 'error-md' : ''}`}
                      placeholder="Select date"
                      min={new Date().toISOString().split("T")[0]}  // ✅ only today & future
                    />
                    {errors.session_start_date && (
                      <span className="error-text-md">{errors.session_start_date}</span>
                    )}
                  </div>


                  <div className="input-group-md full-width-md">
                    <label className="input-label-md">
                      <span>Session Start Time</span>
                      <span className="required-md">*</span>
                    </label>
                    <input  
                      type="time"
                      name="session_start_time"  
                      value={formData.session_start_time || ""} 
                      onChange={handleInputChange}
                      className={`modern-input-md ${errors.session_start_time ? 'error-md' : ''}`}
                      placeholder="Select time"
                    />
                    {errors.session_start_time && (
                      <span className="error-text-md">{errors.session_start_time}</span>
                    )}
                  </div>


                  <div className="input-group-md full-width-md">
                    <label className="input-label-md">
                      <span>Session Description</span>
                      <span className="required-md">*</span>
                    </label>
                    <textarea
                      name="session_description"
                      value={formData.session_description}
                      onChange={handleInputChange}
                      className={`modern-textarea-md ${errors.session_description ? 'error-md' : ''}`}
                      placeholder="Describe what participants will learn, the topics you'll cover, and any prerequisites..."
                      rows="5"
                    />
                    {errors.session_description && <span className="error-text-md">{errors.session_description}</span>}
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
                  <div className="input-group-md full-width-md">
                    <label className="input-label-md">
                      <span>Session Link</span>
                      <span className="required-md">*</span>
                    </label>
                    <input
                      type="url"
                      name="session_link"
                      value={formData.session_link}
                      onChange={handleInputChange}
                      className={`modern-input-md ${errors.session_link ? 'error-md' : ''}`}
                      placeholder="https://meet.google.com/your-meeting-link"
                    />
                    {errors.session_link && <span className="error-text-md">{errors.session_link}</span>}
                  </div>

                  <div className="input-group-md full-width-md">
                    <label className="input-label-md">Session Resources</label>
                    <div
                      className={`file-upload-area-md ${dragActive ? 'drag-active-md' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="upload-icon-md">📁</div>
                      <div className="upload-text-md">
                        <strong>Drag & drop files here</strong>
                        <span>or click to browse</span>
                      </div>
                      <input
                        type="file"
                        name="session_resources"
                        onChange={handleInputChange}
                        className="file-input-md"
                        multiple
                      />
                      {formData.session_resources && (
                        <div className="uploaded-file-md">
                          {Array.from(formData.session_resources).map((file, idx) => (
                            <span key={idx}>📄 {file.name}</span>
                          ))}
                          {uploadProgress < 100 && (
                            <div className="upload-progress-md">
                              <div className="progress-bar-md" style={{width: `${uploadProgress}%`}}></div>
                            </div>
                          )}
                        </div>
                      )}
                       </div>
                    <div className="file-info-md">
                      Supported formats: PDF, DOC, PPT, TXT, ZIP (Max: 10MB)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions-md">
            <div className="action-buttons-md">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-md btn-secondary-md">
                  ← Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button type="button" onClick={nextStep} className="btn-md btn-primary-md">
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-md btn-success-md"
                  disabled={isSubmitting}
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
            <div className="progress-indicator-md">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSessionCreate;
