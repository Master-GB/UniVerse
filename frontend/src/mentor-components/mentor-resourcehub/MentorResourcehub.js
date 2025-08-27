import React, { useState, useRef } from 'react';
import './MentorResourcehub.css';

const MentorResourcehub = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    sub_category: '',
    typeOfRes: '',
    contentType: '',
    fileUrl: '',
    thumbnailUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [submissionError, setSubmissionError] = useState(''); // For server errors
  const fileInputRef = useRef(null); // To clear file input



  const contentTypeOptions = ['pdf', 'video', 'link', 'image', 'document'];
  
  const typeOfResOptions = ['LectureVideo', 'LectureNote', 'PastPaper', 'Paper', 'Other'];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setSubmissionError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileUrl: `uploading-${file.name}`,
      }));

      // Simulate async upload
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          fileUrl: `https://drive.google.com/file/d/mock-${file.name}/view`, 
        }));
        console.log('File "uploaded" to Google Drive:', file.name);
      }, 1000); 

      if (errors.fileUrl) {
        setErrors((prev) => ({
          ...prev,
          fileUrl: '',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.sub_category.trim()) {
      newErrors.sub_category = 'Sub-category is required';
    }

    if (!formData.contentType) {
      newErrors.contentType = 'Content type is required';
    }

    if (!formData.typeOfRes) {
      newErrors.typeOfRes = 'Type of resource is required';
    }

    if (!formData.fileUrl.trim()) {
      newErrors.fileUrl =
        uploadMethod === 'url' ? 'File URL is required' : 'Please upload a file';
    }

    if (uploadMethod === 'url' && formData.fileUrl && formData.fileUrl.trim()) {
      const url = formData.fileUrl.trim();
      try {
        new URL(url);
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          newErrors.fileUrl = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.fileUrl = 'Please enter a valid URL (e.g., https://drive.google.com/...)';
      }
    }

    // Thumbnail URL validation (if provided) - more permissive
    if (formData.thumbnailUrl && formData.thumbnailUrl.trim()) {
      const url = formData.thumbnailUrl.trim();
      try {
        new URL(url);
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          newErrors.thumbnailUrl = 'Thumbnail URL must start with http:// or https://';
        }
      } catch {
        newErrors.thumbnailUrl = 'Please enter a valid thumbnail URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmissionData = () => {
    const cleanData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      category: formData.category.trim(),
      sub_category: formData.sub_category.trim(),
      typeOfRes: formData.typeOfRes || null,
      contentType: formData.contentType,
      fileUrl: formData.fileUrl.trim(),
      thumbnailUrl: formData.thumbnailUrl.trim() || null,
    };

    console.log('Prepared submission data:', cleanData);
    return cleanData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(''); // Clear previous submission errors

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    // Prevent submission if file is still "uploading"
    if (formData.fileUrl.startsWith('uploading-')) {
      setSubmissionError('Please wait for the file to finish uploading.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = prepareSubmissionData();
      console.log('Submitting data:', submissionData);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

      const response = await fetch('http://localhost:8070/mentor-resourcehub/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submissionData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const textError = await response.text();
          errorData = { message: textError || `HTTP ${response.status}` };
        }

        console.error('Server error response:', errorData);
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          console.error('Validation errors:', errorData.errors);
          const validationMessages = errorData.errors.map(err => 
            typeof err === 'string' ? err : err.message || JSON.stringify(err)
          ).join('; ');
          throw new Error(`Validation error: ${validationMessages}`);
        }
        
        throw new Error(
          errorData.message || 
          errorData.error || 
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('Resource added successfully:', result);

      setFormData({
        title: '',
        description: '',
        category: '',
        sub_category: '',
        typeOfRes: '',
        contentType: '',
        fileUrl: '',
        thumbnailUrl: '',
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setErrors({});
      alert('Resource added successfully!');
      window.location.reload();
      
    } catch (error) {
      console.error('Error submitting resource:', error);
      
      if (error.name === 'AbortError') {
        setSubmissionError('Request timed out. Please check your connection and try again.');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setSubmissionError('Cannot connect to server. Please ensure the server is running on http://localhost:8070');
      } else {
        setSubmissionError(
          error.message || 'Error adding resource. Please check your data and try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      setFormData({
        title: '',
        description: '',
        category: '',
        sub_category: '',
        typeOfRes: '',
        contentType: '',
        fileUrl: '',
        thumbnailUrl: '',
      });
      setErrors({});
      setSubmissionError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      window.history.back();
    }
  };

  const navigateToManageResources = () => {
    window.location.href = '/mentor-manage-resources';
  };

  return (
    <div className="add-resource-page-mr">
      <div className="bg-animation-mr">
        <div className="floating-shapes-mr">
          <div className="shape-mr"></div>
          <div className="shape-mr"></div>
          <div className="shape-mr"></div>
        </div>
      </div>

      <header className="header-mr">
        <div className="header-content-mr">
          <button className="back-btn-mr" onClick={() => window.history.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1>Add Academic Resource</h1>
          <button className="manage-btn-mr" onClick={navigateToManageResources}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Manage Resources
          </button>
        </div>
      </header>

      <div className="container-mr">
        <div className="form-card-mr">
          <h2 className="form-title-mr">Create New Resource</h2>
          <p className="form-subtitle-mr">Share knowledge and help students learn better</p>

          {submissionError && (
            <div className="error-message-mr">
              <strong>Submission Error:</strong> {submissionError}
              <button 
                type="button" 
                onClick={() => setSubmissionError('')}
                style={{ float: 'right', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-mr">
              <div className="form-group-mr full-width-mr">
                <label className="form-label-mr">
                  Title <span className="required-mr">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input-mr ${errors.title ? 'error-mr' : ''}`}
                  placeholder="Enter resource title"
                  maxLength="200"
                />
                {errors.title && <span className="error-text-mr">{errors.title}</span>}
              </div>

              <div className="form-group-mr">
                <label className="form-label-mr">
                  Category <span className="required-mr">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-input-mr ${errors.category ? 'error-mr' : ''}`}
                  placeholder="e.g., Mathematics, Physics"
                  maxLength="100"
                />
                {errors.category && <span className="error-text-mr">{errors.category}</span>}
              </div>

              <div className="form-group-mr">
                <label className="form-label-mr">
                  Sub Category <span className="required-mr">*</span>
                </label>
                <input
                  type="text"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleInputChange}
                  className={`form-input-mr ${errors.sub_category ? 'error-mr' : ''}`}
                  placeholder="e.g., Calculus, Mechanics"
                  maxLength="100"
                />
                {errors.sub_category && <span className="error-text-mr">{errors.sub_category}</span>}
              </div>

              <div className="form-group-mr">
                <label className="form-label-mr">
                  Type of Resource <span className="required-mr">*</span>
                </label>
                <select
                  name="typeOfRes"
                  value={formData.typeOfRes}
                  onChange={handleInputChange}
                  className={`form-select-mr ${errors.typeOfRes ? 'error-mr' : ''}`}
                >
                  <option value="">Select type</option>
                  {typeOfResOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.typeOfRes && <span className="error-text-mr">{errors.typeOfRes}</span>}
              </div>

              <div className="form-group-mr">
                <label className="form-label-mr">
                  Content Type <span className="required-mr">*</span>
                </label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  className={`form-select-mr ${errors.contentType ? 'error-mr' : ''}`}
                >
                  <option value="">Select content type</option>
                  {contentTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.contentType && <span className="error-text-mr">{errors.contentType}</span>}
              </div>

              <div className="form-group-mr full-width-mr">
                <label className="form-label-mr">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea-mr"
                  placeholder="Provide a detailed description of the resource"
                  rows="4"
                  maxLength="1000"
                />
              </div>

              <div className="form-group-mr full-width-mr">
                <label className="form-label-mr">
                  Resource Source <span className="required-mr">*</span>
                </label>
                <div className="upload-method-toggle-mr">
                  <button
                    type="button"
                    className={`toggle-btn-mr ${uploadMethod === 'url' ? 'active-mr' : ''}`}
                    onClick={() => setUploadMethod('url')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Google Drive Link
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn-mr ${uploadMethod === 'file' ? 'active-mr' : ''}`}
                    onClick={() => setUploadMethod('file')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Upload File
                  </button>
                </div>
              </div>

              <div className="form-group-mr full-width-mr">
                {uploadMethod === 'url' ? (
                  <>
                    <label className="form-label-mr">
                      Google Drive Share Link <span className="required-mr">*</span>
                    </label>
                    <input
                      type="url"
                      name="fileUrl"
                      value={formData.fileUrl}
                      onChange={handleInputChange}
                      className={`form-input-mr ${errors.fileUrl ? 'error-mr' : ''}`}
                      placeholder="https://drive.google.com/file/d/your-file-id/view"
                    />
                    <div className="input-help-mr">
                      📝 Upload your file to Google Drive first, then paste the share link here
                    </div>
                    {errors.fileUrl && <span className="error-text-mr">{errors.fileUrl}</span>}
                  </>
                ) : (
                  <>
                    <label className="form-label-mr">
                      Upload File <span className="required-mr">*</span>
                    </label>
                    <div className="file-upload-mr">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.mp4,.mov,.avi,.jpg,.jpeg,.png,.doc,.docx"
                        ref={fileInputRef}
                      />
                      <div className="upload-icon-mr">
                        {formData.fileUrl.startsWith('uploading-') ? '⏳' : '📁'}
                      </div>
                      <div className="upload-text-mr">
                        {formData.fileUrl
                          ? formData.fileUrl.startsWith('uploading-')
                            ? `Uploading: ${formData.fileUrl.replace('uploading-', '')}`
                            : `Selected: ${formData.fileUrl.replace('https://drive.google.com/file/d/mock-', '').replace('/view', '')}`
                          : 'Choose file to upload to Google Drive'}
                      </div>
                      <div className="upload-subtext-mr">
                        File will be uploaded to Google Drive automatically
                      </div>
                    </div>
                    {errors.fileUrl && <span className="error-text-mr">{errors.fileUrl}</span>}
                  </>
                )}
              </div>

              <div className="form-group-mr full-width-mr">
                <label className="form-label-mr">Thumbnail URL (Optional)</label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  className={`form-input-mr ${errors.thumbnailUrl ? 'error-mr' : ''}`}
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <div className="input-help-mr">
                  💡 Add a preview image for better visual appeal
                </div>
                {errors.thumbnailUrl && <span className="error-text-mr">{errors.thumbnailUrl}</span>}
              </div>
            </div>

            <div className="btn-group-mr">
              <button
                type="button"
                className="btn-mr btn-secondary-mr"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-mr btn-primary-mr"
                disabled={isSubmitting || formData.fileUrl.startsWith('uploading-')}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-mr"></div>
                    Adding Resource...
                  </>
                ) : (
                  'Add Resource'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorResourcehub;