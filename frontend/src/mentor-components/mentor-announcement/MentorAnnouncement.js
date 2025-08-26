import React, { useState } from 'react';
import { 
  Calendar, Clock, User, FileText, Link, Tag, Send, X, Upload, Image, Video, File, 
  Trash2, Plus, Eye, Globe, BookOpen, Layers, Settings, Sparkles, Zap, Star,
  ChevronRight, ArrowRight
} from 'lucide-react';
import './MentorAnnouncement.css';
import Navbar from '../mentor-navbar/MentorNavbar';

const MentorshipAnnouncementForm = () => {
  const [formData, setFormData] = useState({
    anc_create_mentor_name: '',
    anc_title: '',
    anc_description: '',
    anc_link: '',
    announcement_type: 'Tech News'
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urlResources, setUrlResources] = useState([]);
  const [currentUrlInput, setCurrentUrlInput] = useState('');
  const [currentUrlTitle, setCurrentUrlTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeResourceTab, setActiveResourceTab] = useState('files');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    const maxSize = 10 * 1024 * 1024;
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
          files: `${file.name} is not a supported file type.`
        }));
        return;
      }

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
      const fileToRemove = prev.find(file => file.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const handleAddUrlResource = () => {
    if (!currentUrlInput.trim()) {
      setErrors(prev => ({
        ...prev,
        urlResource: 'URL is required'
      }));
      return;
    }

    if (!isValidUrl(currentUrlInput)) {
      setErrors(prev => ({
        ...prev,
        urlResource: 'Please enter a valid URL'
      }));
      return;
    }

    const newUrlResource = {
      id: Date.now() + Math.random(),
      url: currentUrlInput,
      title: currentUrlTitle.trim() || extractDomainFromUrl(currentUrlInput)
    };

    setUrlResources(prev => [...prev, newUrlResource]);
    setCurrentUrlInput('');
    setCurrentUrlTitle('');
    setErrors(prev => ({
      ...prev,
      urlResource: ''
    }));
  };

  const removeUrlResource = (resourceId) => {
    setUrlResources(prev => prev.filter(resource => resource.id !== resourceId));
  };

  const extractDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'External Link';
    }
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', {
        ...formData,
        urlResources,
        files: uploadedFiles
      });
      
      setSuccessMessage('Announcement created successfully!');
      handleReset();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving announcement:', error);
      setErrors({ submit: 'Failed to save announcement. Please try again.' });
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
      announcement_type: 'Tech News'
    });
    setUploadedFiles([]);
    setUrlResources([]);
    setCurrentUrlInput('');
    setCurrentUrlTitle('');
    setErrors({});
  };

  // Preview Component
  const RealPreview = ({ formData, uploadedFiles, urlResources }) => (
    <div className="preview-container-ma">
      
      <div className="preview-background-ma">
        <div className="preview-circle-top-right-ma"></div>
        <div className="preview-circle-bottom-left-ma"></div>
      </div>
      
      <div className="preview-content-ma">
        <div className="preview-header-ma">
          <div className="preview-status-ma">
            <div className="status-dot-ma"></div>
            <span className="status-text-ma">LIVE PREVIEW</span>
          </div>
          <div className="preview-time-ma">
            <Clock size={12} />
            {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="preview-body-ma">
          <div className="preview-user-section-ma">
            <div className="user-avatar-ma">
              {formData.anc_create_mentor_name ? formData.anc_create_mentor_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="user-details-ma">
              <div className="user-name-section-ma">
                <h3 className="user-name-ma">
                  {formData.anc_create_mentor_name || 'Mentor Name'}
                </h3>
                <span className="announcement-type-ma">
                  {formData.announcement_type}
                </span>
              </div>
              <h4 className="announcement-title-ma">
                {formData.anc_title || 'Announcement Title'}
              </h4>
              <p className="announcement-description-ma">
                {formData.anc_description || 'Your announcement description will appear here...'}
              </p>
              
              {formData.anc_link && (
                <div className="resource-link-ma">
                  <a 
                    href={formData.anc_link} 
                    className="link-text-ma"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Link size={14} />
                    Primary Resource
                    <ArrowRight size={12} />
                  </a>
                </div>
              )}
              
              {(uploadedFiles.length > 0 || urlResources.length > 0) && (
                <div className="resources-section-ma">
                  {uploadedFiles.length > 0 && (
                    <div className="file-count-ma">
                      <File size={12} />
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} attached
                    </div>
                  )}
                  {urlResources.length > 0 && (
                    <div className="url-count-ma">
                      <Globe size={12} />
                      {urlResources.length} resource{urlResources.length !== 1 ? 's' : ''} linked
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar/>
      <div className="page-container-ma">
      
        <div className="background-decoration-ma">
          <div className="circle-top-right-ma"></div>
          <div className="circle-bottom-left-ma"></div>
          <div className="circle-center-ma"></div>
        </div>
      
        <div className="particles-ma">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle-ma"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="manage-button-container-ma">
          <button className="manage-button-ma">
            <Settings size={18} className="manage-icon-ma" />
            <span className="manage-text-ma">Manage</span>
          </button>
        </div>
        <div className="main-content-ma">
          <div className="header-ma">
            <div className="header-badge-ma">
              <Sparkles size={16} className="sparkle-icon-ma" />
              Mentorship Platform
              <Sparkles size={16} className="sparkle-icon-ma" />
            </div>
            <h1 className="header-title-ma">
              Create Announcement
            </h1>
            <div className="header-subtitle-ma">
              <Zap size={20} className="zap-icon-ma" />
              Share knowledge, inspire growth
              <Star size={20} className="star-icon-ma" />
            </div>
          </div>
          <div className="content-grid-ma">
            <div className="form-container-ma">
              <div className="form-wrapper-ma">
                <div className="form-background-ma">
                  <div className="form-circle-top-right-ma"></div>
                  <div className="form-circle-bottom-left-ma"></div>
                </div>
                <div className="form-content-ma">
                  {successMessage && (
                    <div className="success-message-ma">
                      <div className="success-icon-ma">✓</div>
                      <span className="success-text-ma">{successMessage}</span>
                    </div>
                  )}
                  <div className="form-sections-ma">
                    <div className="form-grid-ma">
                      <div className="form-group-ma">
                        <label className="form-label-ma">
                          <div className="label-icon-ma mentor-icon-ma">
                            <User size={14} />
                          </div>
                          Mentor Name
                          <span className="required-ma">*</span>
                        </label>
                        <div className="input-wrapper-ma">
                          <input
                            type="text"
                            name="anc_create_mentor_name"
                            value={formData.anc_create_mentor_name}
                            onChange={handleInputChange}
                            className={`form-input-ma ${errors.anc_create_mentor_name ? 'input-error-ma' : ''}`}
                            placeholder="Enter your name"
                          />
                          {formData.anc_create_mentor_name && (
                            <div className="input-status-ma"></div>
                          )}
                        </div>
                        {errors.anc_create_mentor_name && (
                          <p className="error-message-ma">
                            <X size={12} />
                            {errors.anc_create_mentor_name}
                          </p>
                        )}
                      </div>
                      <div className="form-group-ma">
                        <label className="form-label-ma">
                          <div className="label-icon-ma category-icon-ma">
                            <Tag size={14} />
                          </div>
                          Category
                        </label>
                        <div className="input-wrapper-ma">
                          <select
                            name="announcement_type"
                            value={formData.announcement_type}
                            onChange={handleInputChange}
                            className="form-select-ma"
                          >
                            <option value="Tech News">📚 Tech News</option>
                            <option value="AI">🤖 AI</option>
                            <option value="Tools">🔧 Tools</option>
                            <option value="Tech Stack">💻 Tech Stack</option>
                            <option value="Web">🌐 Web</option>
                            <option value="Entrepreneurship">🚀 Entrepreneurship</option>
                            <option value="Engineering">⚙️ Engineering</option>
                          </select>
                          <ChevronRight size={16} className="select-arrow-ma" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group-ma">
                      <label className="form-label-ma">
                        <div className="label-icon-ma date-icon-ma">
                          <Clock size={14} />
                        </div>
                        Date & Time
                      </label>
                      <div className="date-display-ma">
                        <Calendar size={16} className="calendar-icon-ma" />
                        <span className="date-text-ma">
                          {new Date().toLocaleDateString('en-GB')} - {new Date().toLocaleTimeString('en-GB')}
                        </span>
                        <div className="date-status-ma"></div>
                      </div>
                    </div>
                    <div className="form-group-ma">
                      <label className="form-label-ma">
                        <div className="label-icon-ma title-icon-ma">
                          <FileText size={14} />
                        </div>
                        Announcement Title
                        <span className="required-ma">*</span>
                      </label>
                      <div className="input-wrapper-ma">
                        <input
                          type="text"
                          name="anc_title"
                          value={formData.anc_title}
                          onChange={handleInputChange}
                          className={`form-input-ma ${errors.anc_title ? 'input-error-ma' : ''}`}
                          placeholder="Enter announcement title"
                        />
                        {formData.anc_title && (
                          <div className="input-status-ma"></div>
                        )}
                      </div>
                      {errors.anc_title && (
                        <p className="error-message-ma">
                          <X size={12} />
                          {errors.anc_title}
                        </p>
                      )}
                    </div>
                    <div className="form-group-ma">
                      <label className="form-label-ma">
                        <div className="label-icon-ma description-icon-ma">
                          <FileText size={14} />
                        </div>
                        Description
                        <span className="required-ma">*</span>
                      </label>
                      <div className="input-wrapper-ma">
                        <textarea
                          name="anc_description"
                          value={formData.anc_description}
                          onChange={handleInputChange}
                          className={`form-textarea-ma ${errors.anc_description ? 'input-error-ma' : ''}`}
                          placeholder="Write your announcement details here..."
                          rows="4"
                        />
                        <div className="char-count-ma">
                          {formData.anc_description.length} chars
                        </div>
                      </div>
                      {errors.anc_description && (
                        <p className="error-message-ma">
                          <X size={12} />
                          {errors.anc_description}
                        </p>
                      )}
                    </div>
                    <div className="form-group-ma">
                      <label className="form-label-ma">
                        <div className="label-icon-ma link-icon-ma">
                          <Link size={14} />
                        </div>
                        Primary Resource Link
                        <span className="optional-ma">Optional</span>
                      </label>
                      <div className="input-wrapper-ma">
                        <input
                          type="url"
                          name="anc_link"
                          value={formData.anc_link}
                          onChange={handleInputChange}
                          className={`form-input-ma ${errors.anc_link ? 'input-error-ma' : ''}`}
                          placeholder="https://example.com/resource"
                        />
                        {formData.anc_link && isValidUrl(formData.anc_link) && (
                          <div className="input-status-ma"></div>
                        )}
                      </div>
                      {errors.anc_link && (
                        <p className="error-message-ma">
                          <X size={12} />
                          {errors.anc_link}
                        </p>
                      )}
                    </div>
                    <div className="resources-section-ma">
                      <div className="resources-header-ma">
                        <div className="resources-title-ma">
                          <div className="resources-icon-ma">
                            <Layers size={20} />
                          </div>
                          <h3 className="resources-title-text-ma">Additional Resources</h3>
                        </div>
                        <div className="resources-tabs-ma">
                          <button
                            onClick={() => setActiveResourceTab('files')}
                            className={`tab-button-ma ${activeResourceTab === 'files' ? 'tab-active-ma' : ''}`}
                          >
                            <Upload size={16} />
                            Files
                          </button>
                          <button
                            onClick={() => setActiveResourceTab('urls')}
                            className={`tab-button-ma ${activeResourceTab === 'urls' ? 'tab-active-ma' : ''}`}
                          >
                            <Globe size={16} />
                            URLs
                          </button>
                        </div>
                      </div>
                      {activeResourceTab === 'files' && (
                        <div className="files-section-ma">
                          <div
                            className={`file-upload-area-ma ${dragActive ? 'drag-active-ma' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-input-ma').click()}
                          >
                            <div className="file-upload-content-ma">
                              <div className="file-upload-icon-ma">
                                <Upload size={24} />
                              </div>
                              <div>
                                <p className="file-upload-text-ma">
                                  Drop files here or click to upload
                                </p>
                                <p className="file-upload-info-ma">
                                  Images (JPEG, PNG, GIF) and Videos (MP4, WebM, OGG)
                                </p>
                                <p className="file-upload-size-ma">
                                  Maximum file size: 10MB per file
                                </p>
                              </div>
                            </div>
                            <input
                              id="file-input-ma"
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={handleFileInputChange}
                              className="file-input-ma"
                            />
                          </div>
      
                          {errors.files && (
                            <p className="error-message-ma">
                              <X size={12} />
                              {errors.files}
                            </p>
                          )}
                          {uploadedFiles.length > 0 && (
                            <div className="uploaded-files-ma">
                              <div className="files-header-ma">
                                <File size={16} className="file-icon-ma" />
                                Uploaded Files ({uploadedFiles.length})
                              </div>
                              <div className="files-grid-ma">
                                {uploadedFiles.map((fileObj) => (
                                  <div key={fileObj.id} className="file-item-ma">
                                    <div className="file-preview-ma">
                                      {fileObj.preview ? (
                                        <img src={fileObj.preview} alt={fileObj.name} className="preview-image-ma" />
                                      ) : (
                                        <div className="preview-placeholder-ma">
                                          {getFileIcon(fileObj.type)}
                                        </div>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeFile(fileObj.id);
                                        }}
                                        className="remove-file-ma"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                    <div className="file-info-ma">
                                      <p className="file-name-ma">
                                        {fileObj.name}
                                      </p>
                                      <p className="file-size-ma">
                                        {formatFileSize(fileObj.size)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {activeResourceTab === 'urls' && (
                        <div className="urls-section-ma">
                          <div className="url-input-grid-ma">
                            <div className="url-inputs-ma">
                              <div>
                                <label className="form-label-ma">
                                  <Globe size={14} className="globe-icon-ma" />
                                  Resource URL
                                </label>
                                <input
                                  type="url"
                                  value={currentUrlInput}
                                  onChange={(e) => {
                                    setCurrentUrlInput(e.target.value);
                                    if (errors.urlResource) {
                                      setErrors(prev => ({ ...prev, urlResource: '' }));
                                    }
                                  }}
                                  className={`form-input-ma ${errors.urlResource ? 'input-error-ma' : ''}`}
                                  placeholder="https://example.com/resource"
                                />
                              </div>
                              <div>
                                <label className="form-label-ma">
                                  <BookOpen size={14} className="book-icon-ma" />
                                  Title (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={currentUrlTitle}
                                  onChange={(e) => setCurrentUrlTitle(e.target.value)}
                                  className="form-input-ma"
                                  placeholder="Custom title for the resource"
                                />
                              </div>
                            </div>
                            <div className="url-add-button-ma">
                              <button
                                onClick={handleAddUrlResource}
                                className="add-url-button-ma"
                              >
                                <Plus size={18} />
                                Add URL
                              </button>
                            </div>
                          </div>
      
                          {errors.urlResource && (
                            <p className="error-message-ma">
                              <X size={12} />
                              {errors.urlResource}
                            </p>
                          )}
                          {urlResources.length > 0 && (
                            <div className="url-resources-ma">
                              <div className="url-resources-header-ma">
                                <Globe size={16} className="globe-icon-ma" />
                                URL Resources ({urlResources.length})
                              </div>
                              <div className="url-list-ma">
                                {urlResources.map(resource => (
                                  <div key={resource.id} className="url-item-ma">
                                    <div className="url-content-ma">
                                      <div className="url-icon-ma">
                                        <Globe size={20} />
                                      </div>
                                      <div className="url-details-ma">
                                        <h4 className="url-title-ma">
                                          {resource.title}
                                        </h4>
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="url-link-ma"
                                        >
                                          {resource.url}
                                        </a>
                                      </div>
                                      <button
                                        onClick={() => removeUrlResource(resource.id)}
                                        className="remove-url-ma"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.submit && (
                      <div className="submit-error-ma">
                        {errors.submit}
                      </div>
                    )}
                    <div className="form-actions-ma">
                      <button
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="reset-button-ma"
                      >
                        <X size={18} />
                        Reset Form
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="submit-button-ma"
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
                            <Sparkles size={16} className="sparkle-icon-ma" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-section-ma">
              <div className="preview-wrapper-ma">
                <div className="preview-header-ma">
                  <div className="preview-icon-ma">
                    <Eye size={20} />
                  </div>
                  <h3 className="preview-title-ma">Live Preview</h3>
                  <div className="preview-status-ma">
                    <div className="status-dot-ma"></div>
                    <span className="status-text-ma">LIVE</span>
                  </div>
                </div>
                <RealPreview
                  formData={formData}
                  uploadedFiles={uploadedFiles}
                  urlResources={urlResources}
                />
              </div>
              <div className="quick-stats-ma">
                <div className="stat-item-ma">
                  <div className="stat-value-ma">
                    {uploadedFiles.length}
                  </div>
                  <div className="stat-label-ma">Files</div>
                </div>
                <div className="stat-item-ma">
                  <div className="stat-value-ma">
                    {urlResources.length}
                  </div>
                  <div className="stat-label-ma">URLs</div>
                </div>
                <div className="stat-item-ma">
                  <div className="stat-value-ma">
                    {formData.anc_description.length}
                  </div>
                  <div className="stat-label-ma">Chars</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipAnnouncementForm;