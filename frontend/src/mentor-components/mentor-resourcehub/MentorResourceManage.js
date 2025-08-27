import "./MentorResourceManage.css";
import { useState, useEffect } from 'react';
import { Trash2, X, AlertCircle, Search, Edit3, Eye, Plus, Filter, Download, ExternalLink, Home } from 'lucide-react';

const MentorResourceManage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterContentType, setFilterContentType] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const contentTypeOptions = ['pdf', 'video', 'link', 'image', 'document'];
  const typeOfResOptions = ['LectureVideo', 'LectureNote', 'PastPaper', 'Paper', 'Other'];

  // Load resources
  useEffect(() => {
    loadResources();
  }, []);

  // Filter resources when search or filter changes
  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, filterCategory, filterContentType]);

  const loadResources = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8070/mentor-resourcehub/display');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data.resources)) {
        setResources(data.resources);
      } else if (Array.isArray(data)) {
        setResources(data);
      } else {
        setResources([]);
        console.warn('Unexpected data format:', data);
      }
    } catch (err) {
      console.error('Error loading resources:', err);
      setError(`Failed to load resources: ${err.message}`);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    const resourcesArray = Array.isArray(resources) ? resources : [];
    let filtered = resourcesArray;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.sub_category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(resource =>
        resource.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (filterContentType) {
      filtered = filtered.filter(resource =>
        resource.contentType === filterContentType
      );
    }

    setFilteredResources(filtered);
  };

  const handleView = (resource) => {
    setSelectedResource(resource);
    setShowViewModal(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource({ ...resource });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = (resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const validateForm = (resource) => {
    const errors = {};
    
    if (!resource.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!resource.category?.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!resource.sub_category?.trim()) {
      errors.sub_category = 'Sub-category is required';
    }
    
    if (!resource.contentType) {
      errors.contentType = 'Content type is required';
    }
    
    if (!resource.fileUrl?.trim()) {
      errors.fileUrl = 'File URL is required';
    } else if (!/^https?:\/\/.+/.test(resource.fileUrl)) {
      errors.fileUrl = 'Please enter a valid URL';
    }
    
    if (resource.thumbnailUrl && resource.thumbnailUrl.trim() && !/^https?:\/\/.+/.test(resource.thumbnailUrl)) {
      errors.thumbnailUrl = 'Please enter a valid URL';
    }
    
    return errors;
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');

    const validationErrors = validateForm(selectedResource);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setError('Please fix the validation errors');
      setIsUpdating(false);
      return;
    }

    const payload = {
      title: selectedResource.title,
      description: selectedResource.description,
      category: selectedResource.category,
      sub_category: selectedResource.sub_category,
      typeOfRes: selectedResource.typeOfRes,
      contentType: selectedResource.contentType,
      fileUrl: selectedResource.fileUrl,
      thumbnailUrl: selectedResource.thumbnailUrl,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      const resourceId = selectedResource._id || selectedResource.id;
      const response = await fetch(`http://localhost:8070/mentor-resourcehub/update/${resourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP ${response.status}`);
      }

      setShowEditModal(false);
      setSelectedResource(null);
      setIsUpdating(false);
      await loadResources();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update resource');
      setIsUpdating(false);
    }
  };

  const handleDeleteResource = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const resourceId = selectedResource._id || selectedResource.id;
      
      if (!resourceId) {
        setError('Resource ID not found');
        setIsDeleting(false);
        return;
      }

      const response = await fetch(`http://localhost:8070/mentor-resourcehub/delete/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      // Remove the deleted resource from state
      setResources(prev => prev.filter(r => (r._id || r.id) !== resourceId));
      
      setShowDeleteModal(false);
      setSelectedResource(null);
      setIsDeleting(false);
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete resource');
      setIsDeleting(false);
    }
  };

  const getContentTypeIcon = (contentType) => {
    const icons = {
      pdf: '📄',
      video: '🎥',
      link: '🔗',
      image: '🖼️',
      document: '📝'
    };
    return icons[contentType] || '📄';
  };

  const getResourceTypeColor = (typeOfRes) => {
    const colors = {
      LectureVideo: 'resource-type-blue-mrm',
      LectureNote: 'resource-type-green-mrm',
      PastPaper: 'resource-type-orange-mrm',
      Paper: 'resource-type-purple-mrm',
      Other: 'resource-type-gray-mrm'
    };
    return colors[typeOfRes] || 'resource-type-gray-mrm';
  };

  const categories = [...new Set(resources.map(r => r.category))];

  const handleNavigateHome = () => {
    window.location.href = '/mentor-dashboard';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedResource(null);
    setError('');
    setFormErrors({});
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedResource(null);
    setError('');
  };

  const handleInputChange = (field, value) => {
    setSelectedResource(prev => ({...prev, [field]: value}));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <div className="manage-resources-container-mrm">
      {/* Header */}
      <div className="header-section-mrm">
        <div className="header-content-mrm">
          <div className="header-text-mrm">
            <h1 className="main-title-mrm">Manage Resources</h1>
            <p className="subtitle-mrm">View, edit, and organize your academic resources</p>
          </div>
          <div className="header-buttons-mrm">
            <button
              onClick={handleNavigateHome}
              className="home-button-mrm"
              title="Go to Dashboard"
            >
              <Home size={20} />
              Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/mentor/add-resource'}
              className="add-button-mrm"
            >
              <Plus size={20} />
              Add New Resource
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section-mrm">
        <div className="filters-grid-mrm">
          <div className="search-container-mrm">
            <Search className="search-icon-mrm" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-mrm"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select-mrm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterContentType}
            onChange={(e) => setFilterContentType(e.target.value)}
            className="filter-select-mrm"
          >
            <option value="">All Types</option>
            {contentTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
              setFilterContentType('');
            }}
            className="clear-filters-button-mrm"
          >
            <Filter size={18} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message-mrm">
          {error}
        </div>
      )}

      {/* Resources Grid/List */}
      {loading ? (
        <div className="loading-container-mrm">
          <div className="spinner-mrm"></div>
          <p className="loading-text-mrm">Loading resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="no-results-container-mrm">
          <p className="no-results-title-mrm">No resources found</p>
          <p className="no-results-subtitle-mrm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="resources-grid-mrm">
          {filteredResources.map((resource) => (
            <div className="resource-card-style-mrm" key={resource._id || resource.id}>
              <div key={resource._id || resource.id} className="resource-card-mrm">
                {/* Thumbnail */}
                <div className="resource-thumbnail-mrm">
                  {resource.thumbnailUrl ? (
                    <img
                      src={resource.thumbnailUrl}
                      alt={resource.title}
                      className="thumbnail-image-mrm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.querySelector('.thumbnail-placeholder-mrm').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="thumbnail-placeholder-mrm" style={{display: resource.thumbnailUrl ? 'none' : 'flex'}}>
                    {getContentTypeIcon(resource.contentType)}
                  </div>
                  <div className="resource-type-badge-mrm">
                    <span className={`badge-mrm ${getResourceTypeColor(resource.typeOfRes)}`}>
                      {resource.typeOfRes}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="resource-content-mrm">
                  <h3 className="resource-title-mrm">{resource.title}</h3>
                  <p className="resource-description-mrm">{resource.description}</p>
              
                  <div className="resource-details-mrm">
                    <p><strong>Category:</strong> {resource.category}</p>
                    <p><strong>Sub-category:</strong> {resource.sub_category}</p>
                    <p><strong>Type:</strong> {resource.contentType}</p>
                    <p><strong>Updated:</strong> {resource.updatedAt}</p>
                  </div>
                  {/* Actions */}
                  <div className="resource-actions-mrm">
                    <div className="action-buttons-mrm">
                      <button
                        onClick={() => handleView(resource)}
                        className="action-button-mrm view-button-mrm"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(resource)}
                        className="action-button-mrm edit-button-mrm"
                        title="Edit Resource"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(resource)}
                        className="action-button-mrm delete-button-mrm"
                        title="Delete Resource"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button-mrm external-button-mrm"
                      title="Open File"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedResource && (
        <div className="modal-overlay-mrm" onClick={(e) => e.target === e.currentTarget && setShowViewModal(false)}>
          <div className="modal-container-mrm modal-large-mrm">
            <div className="modal-content-mrm">
              <div className="modal-header-mrm">
                <h2 className="modal-title-mrm">Resource Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="modal-close-button-mrm"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body-mrm">
                <div className="form-group-mrm">
                  <label className="form-label-mrm">Title</label>
                  <p className="form-text-mrm">{selectedResource.title}</p>
                </div>
                <div className="form-group-mrm">
                  <label className="form-label-mrm">Description</label>
                  <p className="form-text-mrm">{selectedResource.description}</p>
                </div>
                <div className="form-row-mrm">
                  <div className="form-group-mrm">
                    <label className="form-label-mrm">Category</label>
                    <p className="form-text-mrm">{selectedResource.category}</p>
                  </div>
                  <div className="form-group-mrm">
                    <label className="form-label-mrm">Sub-category</label>
                    <p className="form-text-mrm">{selectedResource.sub_category}</p>
                  </div>
                </div>
                <div className="form-row-mrm">
                  <div className="form-group-mrm">
                    <label className="form-label-mrm">Resource Type</label>
                    <p className="form-text-mrm">{selectedResource.typeOfRes}</p>
                  </div>
                  <div className="form-group-mrm">
                    <label className="form-label-mrm">Content Type</label>
                    <p className="form-text-mrm">{selectedResource.contentType}</p>
                  </div>
                </div>
                <div className="form-group-mrm">
                  <label className="form-label-mrm">File URL</label>
                  <a
                    href={selectedResource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link-mrm"
                  >
                    {selectedResource.fileUrl}
                  </a>
                </div>
                {selectedResource.thumbnailUrl && (
                  <div className="form-group-mrm">
                    <label className="form-label-mrm">Thumbnail</label>
                    <img
                      src={selectedResource.thumbnailUrl}
                      alt="Thumbnail"
                      className="modal-thumbnail-mrm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedResource && (
        <div className="modal-overlay-mrm" onClick={(e) => e.target === e.currentTarget && closeEditModal()}>
          <div className="modal-scrollable-mrm">
            <div className="modal-container-mrm modal-large-mrm">
              <div className="modal-content-mrm">
                <div className="modal-header-mrm">
                  <h2 className="modal-title-mrm">Edit Resource</h2>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="modal-close-button-mrm"
                    disabled={isUpdating}
                  >
                    <X size={20} />
                  </button>
                </div>
            
                <div className="modal-body-mrm">
                  {error && (
                    <div className="error-message-mrm" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  <div className="form-container-mrm">
                    <div className="form-group-mrm">
                      <label className="form-label-mrm">Title *</label>
                      <input
                        type="text"
                        value={selectedResource.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`form-input-mrm ${formErrors.title ? 'error-mrm' : ''}`}
                        required
                      />
                      {formErrors.title && (
                        <div className="field-error-mrm">{formErrors.title}</div>
                      )}
                    </div>
            
                    <div className="form-group-mrm">
                      <label className="form-label-mrm">Description</label>
                      <textarea
                        value={selectedResource.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="form-textarea-mrm"
                      />
                    </div>
            
                    <div className="form-row-mrm">
                      <div className="form-group-mrm">
                        <label className="form-label-mrm">Category *</label>
                        <input
                          type="text"
                          value={selectedResource.category || ''}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className={`form-input-mrm ${formErrors.category ? 'error-mrm' : ''}`}
                          required
                        />
                        {formErrors.category && (
                          <div className="field-error-mrm">{formErrors.category}</div>
                        )}
                      </div>
                      <div className="form-group-mrm">
                        <label className="form-label-mrm">Sub-category *</label>
                        <input
                          type="text"
                          value={selectedResource.sub_category || ''}
                          onChange={(e) => handleInputChange('sub_category', e.target.value)}
                          className={`form-input-mrm ${formErrors.sub_category ? 'error-mrm' : ''}`}
                          required
                        />
                        {formErrors.sub_category && (
                          <div className="field-error-mrm">{formErrors.sub_category}</div>
                        )}
                      </div>
                    </div>
            
                    <div className="form-row-mrm">
                      <div className="form-group-mrm">
                        <label className="form-label-mrm">Resource Type</label>
                        <select
                          value={selectedResource.typeOfRes || ''}
                          onChange={(e) => handleInputChange('typeOfRes', e.target.value)}
                          className="form-select-mrm"
                        >
                          <option value="">Select type</option>
                          {typeOfResOptions.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group-mrm">
                        <label className="form-label-mrm">Content Type *</label>
                        <select
                          value={selectedResource.contentType || ''}
                          onChange={(e) => handleInputChange('contentType', e.target.value)}
                          className={`form-select-mrm ${formErrors.contentType ? 'error-mrm' : ''}`}
                          required
                        >
                          <option value="">Select content type</option>
                          {contentTypeOptions.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {formErrors.contentType && (
                          <div className="field-error-mrm">{formErrors.contentType}</div>
                        )}
                      </div>
                    </div>
            
                    <div className="form-group-mrm">
                      <label className="form-label-mrm">File URL *</label>
                      <input
                        type="url"
                        value={selectedResource.fileUrl || ''}
                        onChange={(e) => handleInputChange('fileUrl', e.target.value)}
                        className={`form-input-mrm ${formErrors.fileUrl ? 'error-mrm' : ''}`}
                        placeholder="https://example.com/file.pdf"
                        required
                      />
                      {formErrors.fileUrl && (
                        <div className="field-error-mrm">{formErrors.fileUrl}</div>
                      )}
                    </div>
            
                    <div className="form-group-mrm">
                      <label className="form-label-mrm">Thumbnail URL</label>
                      <input
                        type="url"
                        value={selectedResource.thumbnailUrl || ''}
                        onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                        className={`form-input-mrm ${formErrors.thumbnailUrl ? 'error-mrm' : ''}`}
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                      {formErrors.thumbnailUrl && (
                        <div className="field-error-mrm">{formErrors.thumbnailUrl}</div>
                      )}
                    </div>
                  </div>
                </div>
            
                <div className="modal-footer-mrm">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="cancel-button-mrm"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateResource}
                    className="submit-button-mrm"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="button-spinner-mrm"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Resource'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedResource && (
        <div className="modal-overlay-mrm" onClick={(e) => e.target === e.currentTarget && closeDeleteModal()}>
          <div className="modal-container-mrm modal-small-mrm">
            <div className="modal-content-mrm">
              <div className="delete-modal-header-mrm">
                <div className="delete-icon-container-mrm">
                  <Trash2 className="delete-icon-mrm" size={24} />
                </div>
                <div>
                  <h2 className="modal-title-mrm">Delete Resource</h2>
                  <p className="delete-subtitle-mrm">This action cannot be undone.</p>
                </div>
              </div>
              
              {error && (
                <div className="error-message-mrm" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <div className="delete-modal-body-mrm">
                <p className="delete-confirmation-text-mrm">
                  Are you sure you want to delete "<strong>{selectedResource.title}</strong>"?
                </p>
              </div>
              
              <div className="modal-footer-mrm">
                <button
                  onClick={closeDeleteModal}
                  className="cancel-button-mrm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteResource}
                  className="delete-confirm-button-mrm"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="button-spinner-mrm"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Resource'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorResourceManage;