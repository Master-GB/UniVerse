import React from 'react';
import { 
  Globe, ExternalLink, Image, Video, File, 
  Layers, MessageSquare, MoreHorizontal, Share2, Bookmark,
  ThumbsUp, MessageCircle
} from 'lucide-react';
import './RealPreview.css';

const RealPreview = ({ formData, uploadedFiles, urlResources }) => {
  const extractDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'External Link';
    }
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={16} />;
    if (fileType.startsWith('video/')) return <Video size={16} />;
    return <File size={16} />;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'M';
  };

  const hasContent = formData.anc_create_mentor_name || formData.anc_title || formData.anc_description;
  
  if (!hasContent) {
    return (
      <div className="preview-empty-ma">
        <MessageSquare size={48} className="preview-empty-icon-ma" />
        <p>Start typing to see a preview of your announcement</p>
      </div>
    );
  }

  const getCategoryColor = (type) => {
    const colorMap = {
      'Tech News': '#3B82F6',
      'AI': '#8B5CF6',
      'Tools': '#F59E0B',
      'Tech Stack': '#10B981',
      'Web': '#06B6D4',
      'Entrepreneurship': '#EF4444',
      'Engineering': '#6B7280'
    };
    return colorMap[type] || '#667eea';
  };

  const getTypeEmoji = (type) => {
    const emojiMap = {
      'Tech News': '📚',
      'AI': '🤖',
      'Tools': '🔧',
      'Tech Stack': '💻',
      'Web': '🌐',
      'Entrepreneurship': '🚀',
      'Engineering': '⚙️'
    };
    return emojiMap[type] || '📢';
  };

  return (
    <div>
      <div className="preview-card-ma">
        <div className="preview-card-header-ma">
          <div className="preview-card-meta-ma">
            <div className="avatar-ma">
              {getInitials(formData.anc_create_mentor_name)}
            </div>
            <div className="preview-card-info-ma">
              <div className="mentor-name-ma">
                {formData.anc_create_mentor_name || 'Mentor Name'}
              </div>
              <div className="meta-info-ma">
                <span>{new Date().toLocaleDateString('en-GB')}</span>
                <span className="meta-divider-ma">•</span>
                <span>{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="category-tag-ma" style={{ backgroundColor: `${getCategoryColor(formData.announcement_type)}20`, color: getCategoryColor(formData.announcement_type) }}>
                  {getTypeEmoji(formData.announcement_type)} {formData.announcement_type}
                </div>
              </div>
            </div>
            <div className="relative-ma">
              <MoreHorizontal size={20} className="more-icon-ma" />
            </div>
          </div>
          {formData.anc_title && (
            <h2 className="post-title-ma">
              {formData.anc_title}
            </h2>
          )}
          {formData.anc_description && (
            <p className="post-description-ma">
              {formData.anc_description}
            </p>
          )}
        </div>

        {uploadedFiles.find(f => f.type.startsWith('image/')) && (
          <div className="preview-image-container-ma">
            <img
              src={uploadedFiles.find(f => f.type.startsWith('image/')).preview}
              alt="Preview"
              className="featured-image-ma"
            />
          </div>
        )}

        {(formData.anc_link || urlResources.length > 0 || uploadedFiles.length > 0) && (
          <div className="resources-section-ma">
            <div className="resource-header-ma">
              <Layers size={16} />
              Resources
            </div>
      
            {formData.anc_link && (
              <a href={formData.anc_link} target="_blank" rel="noopener noreferrer" className="resource-link-ma">
                <ExternalLink size={16} />
                <span>{extractDomainFromUrl(formData.anc_link)}</span>
              </a>
            )}

            {urlResources.length > 0 && urlResources.map(resource => (
              <div key={resource.id} className="url-resource-ma">
                <div className="resource-icon-ma">
                  <Globe size={20} color="#667eea" />
                </div>
                <div className="resource-content-ma">
                  <div className="resource-title-ma">
                    {resource.title}
                  </div>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-url-ma">
                    {resource.url.length > 40 ? resource.url.substring(0, 40) + '...' : resource.url}
                  </a>
                </div>
              </div>
            ))}

            {uploadedFiles.length > 1 && (
              <div className="file-grid-ma">
                {uploadedFiles.slice(1).map(fileObj => (
                  <div key={fileObj.id} className="file-item-ma">
                    <div className="file-preview-ma">
                      {fileObj.preview ? (
                        <img src={fileObj.preview} alt={fileObj.name} className="file-image-ma" />
                      ) : (
                        getFileIcon(fileObj.type)
                      )}
                    </div>
                    <div className="file-name-ma">
                      {fileObj.name.length > 12 ? fileObj.name.substring(0, 12) + '...' : fileObj.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealPreview;