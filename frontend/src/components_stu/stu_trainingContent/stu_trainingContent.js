import React, { useState, useEffect } from 'react';
import './stu_trainingContent.css';
import axios from 'axios';
import { 
  FaSearch, 
  FaExternalLinkAlt, 
  FaBookOpen, 
  FaLaptopCode, 
  FaUserGraduate,
  FaChartLine,
  FaBuilding,
  FaRegBookmark,
  FaBookmark,
  FaFilter,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ResourceCard = ({ resource, isSaved, onSave }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'interview': return <FaUserGraduate className="resource-card__icon" />;
      case 'skill': return <FaLaptopCode className="resource-card__icon" />;
      case 'salary': return <FaChartLine className="resource-card__icon" />;
      case 'company': return <FaBuilding className="resource-card__icon" />;
      default: return <FaBookOpen className="resource-card__icon" />;
    }
  };

  return (
    <motion.div
      className="resource-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="resource-card__inner">
        <div className="resource-card__header">
          <span className={`resource-card__category resource-card__category--${resource.category.toLowerCase().replace(/\s+/g, '-')}`}>
            {resource.category}
          </span>
          <button 
            className={`resource-card__save-btn ${isSaved ? 'resource-card__save-btn--saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSave(resource.id);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
        
        <div className="resource-card__content">
          <div className="resource-card__icon-container">
            {getIcon(resource.type)}
          </div>
          <h3 className="resource-card__title">{resource.title}</h3>
          <p className="resource-card__description">{resource.description}</p>
          
          <div className="resource-card__meta">
            {resource.duration && (
              <span className="resource-card__meta-item">
                <svg className="resource-card__meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                {resource.duration}
              </span>
            )}
            {resource.level && (
              <span className="resource-card__meta-item">
                <svg className="resource-card__meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                </svg>
                {resource.level}
              </span>
            )}
          </div>
        </div>
        
        <div className="resource-card__actions">
          <a 
            href={resource.url} 
            className="resource-card__action-btn resource-card__action-btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {resource.actionText || (resource.type === 'video' ? 'Watch Now' : 'View Resource')}
            <FaExternalLinkAlt className="resource-card__action-icon" />
          </a>
          {resource.premium && (
            <span className="resource-card__premium-badge">
              <svg className="resource-card__premium-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
              </svg>
              Premium
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CareerResourceHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedResourceIds, setSavedResourceIds] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resources from backend API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:8070/mentor-career-resource/display');
        // Map the backend data to match the frontend structure
        const formattedResources = response.data.map(resource => ({
          id: resource._id,
          title: resource.title,
          description: resource.description || '',
          type: resource.type,
          category: resource.category,
          url: resource.url || '#',
          actionText: resource.actionText || 'View Resource',
          level: resource.level || 'All Levels',
          duration: resource.duration || 'N/A',
          premium: resource.premium || false
        }));
        setResources(formattedResources);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
    setSavedResourceIds(saved);
  }, []);

  const toggleSave = (id) => {
    setSavedResourceIds(prev => {
      const newSaved = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id];
      localStorage.setItem('savedResources', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const toggleSavedView = () => {
    setShowSavedOnly(!showSavedOnly);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || resource.category === activeFilter;
    const isSaved = savedResourceIds.includes(resource.id);
    
    if (showSavedOnly) {
      return matchesSearch && matchesFilter && isSaved;
    }
    return matchesSearch && matchesFilter;
  });

  const savedResources = resources.filter(resource => 
    savedResourceIds.includes(resource.id)
  );

  const categories = ['All', 'Interview Prep', 'Salary Data', 'Skill Development', 'Company Insights', 'Professional Skills'];

  return (
    <div className="career-resource-hub">
      <div className="career-resource-hub__container">
        <header className="career-resource-hub__hero">
          <div className="career-resource-hub__hero-content">
            <motion.h1 
              className="career-resource-hub__title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Elevate Your <span className="career-resource-hub__gradient-text">Career Journey</span>
            </motion.h1>
            <motion.p
              className="career-resource-hub__subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Access premium resources to accelerate your professional growth and land your dream job
            </motion.p>
          </div>
        </header>

        <div className="career-resource-hub__search-section">
          <div className="career-resource-hub__search-container">
            <div className="career-resource-hub__search-box">
              <FaSearch className="career-resource-hub__search-icon" />
              <input
                type="text"
                className="career-resource-hub__search-input"
                placeholder="Search career resources, skills, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="career-resource-hub__search-actions">
                <button 
                  className={`career-resource-hub__saved-btn ${showSavedOnly ? 'active' : ''}`}
                  onClick={toggleSavedView}
                  aria-label={showSavedOnly ? 'Show all resources' : 'Show saved resources'}
                >
                  <FaBookmark className="career-resource-hub__saved-icon" />
                  <span>{showSavedOnly ? 'Show All' : 'Saved'}</span>
                </button>
                <button 
                  className="career-resource-hub__mobile-filter-btn"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  aria-label="Filter resources"
                >
                  <FaFilter className="career-resource-hub__filter-icon" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
            
            {showMobileFilters && (
              <div className="career-resource-hub__mobile-filters">
                <div className="career-resource-hub__mobile-filters-header">
                  <h3 className="career-resource-hub__mobile-filters-title">Filter Resources</h3>
                  <button 
                    className="career-resource-hub__close-filters"
                    onClick={() => setShowMobileFilters(false)}
                    aria-label="Close filters"
                  >
                    <FaTimes className="career-resource-hub__close-icon" />
                  </button>
                </div>
                <div className="career-resource-hub__category-chips career-resource-hub__category-chips--mobile">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`career-resource-hub__category-chip ${activeFilter === (category === 'All' ? 'all' : category) ? 'career-resource-hub__category-chip--active' : ''}`}
                      onClick={() => {
                        setActiveFilter(category === 'All' ? 'all' : category);
                        setShowMobileFilters(false);
                      }}
                    >
                      {category}
                      {category === 'Interview Prep' && <span className="career-resource-hub__chip-badge">New</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="career-resource-hub__category-chips career-resource-hub__category-chips--desktop">
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`career-resource-hub__category-chip ${activeFilter === (category === 'All' ? 'all' : category) ? 'career-resource-hub__category-chip--active' : ''}`}
                  onClick={() => setActiveFilter(category === 'All' ? 'all' : category)}
                >
                  {category}
                  {category === 'Interview Prep' && <span className="career-resource-hub__chip-badge">New</span>}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          className="career-resource-hub__resources"
          initial="hidden"
          animate="show"
        >
          <div className="career-resource-hub__resources-header">
            <h2 className="career-resource-hub__resources-title">
              {activeFilter === 'all' ? 'All Resources' : activeFilter}
              <span className="career-resource-hub__results-count">{filteredResources.length} resources</span>
            </h2>
            <div className="career-resource-hub__sort-options">
              <span className="career-resource-hub__sort-label">Sort by:</span>
              <select className="career-resource-hub__sort-dropdown">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="career-resource-hub__loading">
              <FaSpinner className="career-resource-hub__spinner" />
              <p>Loading resources...</p>
            </div>
          ) : error ? (
            <div className="career-resource-hub__error">
              <div className="career-resource-hub__error-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"></circle>
                  <path d="M12 8v4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"></path>
                  <path d="M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
              </div>
              <h3 className="career-resource-hub__error-title">Error Loading Resources</h3>
              <p className="career-resource-hub__error-text">{error}</p>
              <button 
                className="career-resource-hub__retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="career-resource-hub__resources-grid">
              <AnimatePresence>
                {filteredResources.map(resource => (
                  <ResourceCard 
                    key={resource.id}
                    resource={resource}
                    isSaved={savedResourceIds.includes(resource.id)}
                    onSave={toggleSave}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              className="career-resource-hub__no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="career-resource-hub__no-results-illustration">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="career-resource-hub__no-results-title">No resources found</h3>
              <p className="career-resource-hub__no-results-text">Try adjusting your search or filter criteria</p>
              <button 
                className="career-resource-hub__clear-filters"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </motion.div>

    
      </div>
    </div>
  );
};

export default CareerResourceHub;