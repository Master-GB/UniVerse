import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Link, Tag, Send, X, Upload, Image, Video, File, Trash2 } from 'lucide-react';
import './MentorAnnouncement.css';
import Navbar from "../mentor-navbar/MentorNavbar"

const MentorshipAnnouncementForm = () => {
  const [formData, setFormData] = useState({
    anc_create_mentor_name: '',
    anc_title: '',
    anc_description: '',
    anc_link: '',
    announcement_type: 'academic' ,// New field for categorization
    anc_resouces: []
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];

    fileArray.forEach(file => {
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          files: `${file.name} is too large. Maximum size is 10MB.`
        }));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          files: `${file.name} is not a supported file type. Only images (JPEG, PNG, GIF) and videos (MP4, WebM, OGG) are allowed.`
        }));
        return;
      }

      // Create preview URL for images
      const fileObj = {
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        id: Date.now() + Math.random()
      };

      validFiles.push(fileObj);
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      setErrors(prev => ({
        ...prev,
        files: ''
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find(file => file.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={16} />;
    if (fileType.startsWith('video/')) return <Video size={16} />;
    return <File size={16} />;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.anc_create_mentor_name.trim()) {
      newErrors.anc_create_mentor_name = 'Mentor name is required';
    }
    
    if (!formData.anc_title.trim()) {
      newErrors.anc_title = 'Announcement title is required';
    }
    
    if (!formData.anc_description.trim()) {
      newErrors.anc_description = 'Description is required';
    } else if (formData.anc_description.length < 10) {
      newErrors.anc_description = 'Description must be at least 10 characters';
    }
    
    if (formData.anc_link && !isValidUrl(formData.anc_link)) {
      newErrors.anc_link = 'Please enter a valid URL';
    }
    
    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
        // Create FormData for file upload
        const submitData = new FormData();
        
        // Append form fields
        submitData.append('anc_create_mentor_name', formData.anc_create_mentor_name);
        submitData.append('anc_title', formData.anc_title);
        submitData.append('anc_description', formData.anc_description);
        submitData.append('anc_link', formData.anc_link);
        submitData.append('announcement_type', formData.announcement_type);

        // Append files with the correct field name 'resources'
        uploadedFiles.forEach((fileObj) => {
            submitData.append('resources', fileObj.file);
        });

        // Make API call
        const response = await fetch('http://localhost:8070/mentorship-announcement/add', {
            method: 'POST',
            body: submitData // FormData automatically sets correct Content-Type
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        setSuccessMessage('Announcement with resources created successfully!');
        setFormData({
            anc_create_mentor_name: '',
            anc_title: '',
            anc_description: '',
            anc_link: '',
            announcement_type: 'academic'
        });
        setUploadedFiles([]);
        
        setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
        console.error('Error creating announcement:', error);
        setErrors({ submit: 'Failed to create announcement. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
};

  const handleReset = () => {
    setFormData({
      anc_create_mentor_name: '',
      anc_title: '',
      anc_description: '',
      anc_link: '',
      announcement_type: 'academic'
    });
    setUploadedFiles([]);
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div>
      <Navbar />
      <div className="announcement-container-ma">
        <div className="announcement-header-ma">
          <div className="header-content-ma">
            <h1 className="page-title-ma">Create Mentorship Announcement</h1>
            <p className="page-subtitle-ma">Share important updates and resources with your students</p>
          </div>
        </div>
        <div className="form-wrapper-ma">
          <div className="form-container-ma">
            {successMessage && (
              <div className="success-message-ma">
                <span className="success-icon-ma">✓</span>
                {successMessage}
              </div>
            )}
            <div className="announcement-form-ma">
              <div className="form-grid-ma">
                {/* Mentor Name */}
                <div className="form-group-ma form-group-full-width-ma">
                  <label htmlFor="anc_create_mentor_name" className="form-label-ma">
                    <User size={18} />
                    Mentor Name
                    <span className="required-ma">*</span>
                  </label>
                  <input
                    type="text"
                    id="anc_create_mentor_name"
                    name="anc_create_mentor_name"
                    value={formData.anc_create_mentor_name}
                    onChange={handleInputChange}
                    className={`form-input-ma ${errors.anc_create_mentor_name ? 'form-input-error-ma' : ''}`}
                    placeholder="Enter your name"
                  />
                  {errors.anc_create_mentor_name && (
                    <span className="error-message-ma">{errors.anc_create_mentor_name}</span>
                  )}
                </div>
                {/* Announcement Type */}
                <div className="form-group-ma">
                  <label htmlFor="announcement_type" className="form-label-ma">
                    <Tag size={18} />
                    Category
                  </label>
                  <select
                    id="announcement_type"
                    name="announcement_type"
                    value={formData.announcement_type}
                    onChange={handleInputChange}
                    className="form-select-ma"
                  >
                    <option value="academic">📚 Academic</option>
                    <option value="technical">💻 Technical</option>
                    <option value="general">📢 General</option>
                    <option value="career">🎯 Career Guidance</option>
                  </select>
                </div>
                {/* Current Date & Time Display */}
                <div className="form-group-ma">
                  <label className="form-label-ma">
                    <Clock size={18} />
                    Date & Time
                  </label>
                  <div className="datetime-display-ma">
                    <Calendar size={16} />
                    {new Date().toLocaleDateString('en-GB')} - {new Date().toLocaleTimeString('en-GB')}
                  </div>
                </div>
                {/* Title */}
                <div className="form-group-ma form-group-full-width-ma">
                  <label htmlFor="anc_title" className="form-label-ma">
                    <FileText size={18} />
                    Announcement Title
                    <span className="required-ma">*</span>
                  </label>
                  <input
                    type="text"
                    id="anc_title"
                    name="anc_title"
                    value={formData.anc_title}
                    onChange={handleInputChange}
                    className={`form-input-ma ${errors.anc_title ? 'form-input-error-ma' : ''}`}
                    placeholder="Enter announcement title"
                  />
                  {errors.anc_title && (
                    <span className="error-message-ma">{errors.anc_title}</span>
                  )}
                </div>
                {/* Description */}
                <div className="form-group-ma form-group-full-width-ma">
                  <label htmlFor="anc_description" className="form-label-ma">
                    <FileText size={18} />
                    Description
                    <span className="required-ma">*</span>
                  </label>
                  <textarea
                    id="anc_description"
                    name="anc_description"
                    value={formData.anc_description}
                    onChange={handleInputChange}
                    className={`form-textarea-ma ${errors.anc_description ? 'form-textarea-error-ma' : ''}`}
                    placeholder="Write your announcement details here..."
                    rows="6"
                  />
                  <div className="char-count-ma">
                    {formData.anc_description.length} characters
                  </div>
                  {errors.anc_description && (
                    <span className="error-message-ma">{errors.anc_description}</span>
                  )}
                </div>
                {/* Optional Link */}
                <div className="form-group-ma form-group-full-width-ma">
                  <label htmlFor="anc_link" className="form-label-ma">
                    <Link size={18} />
                    Resource Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="anc_link"
                    name="anc_link"
                    value={formData.anc_link}
                    onChange={handleInputChange}
                    className={`form-input-ma ${errors.anc_link ? 'form-input-error-ma' : ''}`}
                    placeholder="https://example.com/resource"
                  />
                  {errors.anc_link && (
                    <span className="error-message-ma">{errors.anc_link}</span>
                  )}
                </div>
                {/* File Upload Section */}
                <div className="form-group-ma form-group-full-width-ma">
                  <label className="form-label-ma">
                    <Upload size={18} />
                    Upload Resources (Optional)
                  </label>
                  <div
                    className={`file-upload-area-ma ${dragActive ? 'file-upload-active-ma' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input-ma').click()}
                  >
                    <Upload size={32} className="upload-icon-ma" />
                    <div className="upload-text-ma">
                      <p className="upload-primary-text-ma">Click to upload or drag and drop</p>
                      <p className="upload-secondary-text-ma">Images (JPEG, PNG, GIF) and Videos (MP4, WebM, OGG)</p>
                      <p className="upload-size-text-ma">Maximum file size: 10MB per file</p>
                    </div>
                    <input
                      id="file-input-ma"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileInputChange}
                      className="file-input-hidden-ma"
                    />
                  </div>
                  {errors.files && (
                    <span className="error-message-ma">{errors.files}</span>
                  )}
                </div>
                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="form-group-ma form-group-full-width-ma">
                    <label className="form-label-ma">
                      <File size={18} />
                      Uploaded Resources ({uploadedFiles.length})
                    </label>
                    <div className="uploaded-files-grid-ma">
                      {uploadedFiles.map((fileObj) => (
                        <div key={fileObj.id} className="uploaded-file-card-ma">
                          <div className="file-preview-ma">
                            {fileObj.preview ? (
                              <img
                                src={fileObj.preview}
                                alt={fileObj.name}
                                className="file-preview-image-ma"
                              />
                            ) : (
                              <div className="file-preview-placeholder-ma">
                                {getFileIcon(fileObj.type)}
                              </div>
                            )}
                          </div>
                          <div className="file-info-ma">
                            <div className="file-name-ma" title={fileObj.name}>
                              {fileObj.name.length > 15 ? fileObj.name.substring(0, 15) + '...' : fileObj.name}
                            </div>
                            <div className="file-size-ma">{formatFileSize(fileObj.size)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(fileObj.id)}
                            className="file-remove-btn-ma"
                            title="Remove file"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.submit && (
                <div className="error-message-ma submit-error-ma">
                  {errors.submit}
                </div>
              )}
              <div className="form-actions-ma">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary-ma"
                  disabled={isSubmitting}
                >
                  <X size={18} />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary-ma"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-ma"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Create Announcement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipAnnouncementForm;