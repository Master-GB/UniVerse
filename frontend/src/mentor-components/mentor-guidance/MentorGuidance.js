import React, { useEffect, useState } from "react";
import { Send, MessageCircle, Clock, CheckCircle, User, Search, Eye } from "lucide-react";
import "./MentorGuidance.css";
import Navbar from "../mentor-navbar/MentorNavbar";

const MentorGuidance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [selectedGuidance, setSelectedGuidance] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchGuidances();
    
  }, []);

  const fetchGuidances = () => {
    fetch("http://localhost:8070/guidance/display")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setData(data.guidances || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };



  const fetchGuidanceById = async () => {
    if (!searchId.trim()) {
      setError("Please enter a guidance ID");
      return;
    }

    setSearchLoading(true);
    setSelectedGuidance(null);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8070/guidance/${searchId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Guidance not found");
        } else if (response.status === 400) {
          throw new Error("Invalid guidance ID format");
        } else {
          throw new Error("Failed to fetch guidance");
        }
      }

      const data = await response.json();
      setSelectedGuidance(data.guidance);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSelectedGuidance(null);
    setError(null);
  };

  const handleSendResponse = async (itemId) => {
    if (!responseText.trim()) {
      setError("Please enter a response");
      return;
    }

    if (!mentorName.trim()) {
      setError("Please enter mentor name");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8070/guidance/mentor/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorName: mentorName.trim(),
          response: responseText.trim(),
          responseDate: new Date().toISOString(),
          status: 'answered'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseText("");
        setMentorName("");
        setExpandedItem(null);
        
        // Success message
        console.log("Response submitted successfully:", result.message);
        
        // If we have a selected guidance, refresh it
        if (selectedGuidance && selectedGuidance._id === itemId) {
          // Refresh the selected guidance by searching again
          const refreshResponse = await fetch(`http://localhost:8070/guidance/${itemId}`);
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setSelectedGuidance(refreshData.guidance);
          }
        }
        
        // Also refresh the main list and stats
        fetchGuidances();
        
        
      } else {
        throw new Error(result.message || 'Failed to send response');
      }
    } catch (err) {
      setError(err.message);
      console.error("Error sending response:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpanded = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
    setResponseText("");
    setMentorName("");
    setError(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Navbar />
      <div className="mentor-guidance-wrapper-mg">
        {/* Animated Background */}
        <div className="background-animation-mg">
          <div className="floating-shapes-mg">
            <div className="shape-mg shape1-mg"></div>
            <div className="shape-mg shape2-mg"></div>
            <div className="shape-mg shape3-mg"></div>
            <div className="shape-mg shape4-mg"></div>
          </div>
        </div>
        <div className="mentor-guidance-container-mg">
          <div className="mentor-guidance-header-mg">
            <div className="header-content-mg">
              <MessageCircle className="header-icon-mg" size={32} />
              <h1 className="mentor-guidance-title-mg">Mentor Guidance Center</h1>
              <p className="mentor-guidance-subtitle-mg">
                Manage and respond to student guidance requests
              </p>
            </div>
            {/* Statistics */}
            {stats && (
              <div className="stats-container-mg">
                <div className="stat-item-mg">
                  <span className="stat-number-mg">{stats.total}</span>
                  <span className="stat-label-mg">Total</span>
                </div>
                <div className="stat-item-mg">
                  <span className="stat-number-mg pending-mg">{stats.pending}</span>
                  <span className="stat-label-mg">Pending</span>
                </div>
                <div className="stat-item-mg">
                  <span className="stat-number-mg answered-mg">{stats.answered}</span>
                  <span className="stat-label-mg">Answered</span>
                </div>
              </div>
            )}
            {/* Search by ID */}
            <div className="search-container-mg">
              <div className="search-input-group-mg">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Guidance ID to search..."
                  className="search-input-mg"
                />
                <button
                  onClick={fetchGuidanceById}
                  disabled={searchLoading || !searchId.trim()}
                  className="search-button-mg"
                >
                  {searchLoading ? (
                    <div className="button-spinner-mg"></div>
                  ) : (
                    <Search size={16} />
                  )}
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
                {(selectedGuidance || searchId) && (
                  <button onClick={clearSearch} className="clear-button-mg">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mentor-guidance-content-mg">
            {/* Display searched guidance if exists */}
            {selectedGuidance && (
              <div className="selected-guidance-mg">
                <h3 className="selected-guidance-title-mg">
                  <Eye size={20} />
                  Search Result
                </h3>
                <div className="mentor-guidance-item-mg highlighted-mg">
                  <div className="guidance-header-mg">
                    <div className="guidance-title-section-mg">
                      <h2 className="guidance-title-mg">{selectedGuidance.guidanceTitle}</h2>
                      <span className={`status-badge-mg ${selectedGuidance.status}`}>
                        {selectedGuidance.status === 'pending' ? (
                          <Clock size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {selectedGuidance.status}
                      </span>
                    </div>
                  </div>
                  <div className="guidance-body-mg">
                    <p className="guidance-description-mg">{selectedGuidance.guidanceDiscription}</p>
      
                    <div className="guidance-meta-mg">
                      <div className="meta-item-mg">
                        <User size={16} />
                        <span>Student: {selectedGuidance.studentGName || 'Anonymous'}</span>
                      </div>
                      <div className="meta-item-mg">
                        <User size={16} />
                        <span>Mentor: {selectedGuidance.mentorName}</span>
                      </div>
                      <div className="meta-item-mg">
                        <Clock size={16} />
                        <span>Created: {formatDate(selectedGuidance.guidanceDate)}</span>
                      </div>
                      {selectedGuidance.responseDate && selectedGuidance.response !== "No response yet" && (
                        <div className="meta-item-mg">
                          <Clock size={16} />
                          <span>Responded: {formatDate(selectedGuidance.responseDate)}</span>
                        </div>
                      )}
                    </div>
                    {selectedGuidance.response && selectedGuidance.response !== "No response yet" && (
                      <div className="response-section-mg">
                        <h4 className="response-label-mg">Response:</h4>
                        <p className="response-text-mg">{selectedGuidance.response}</p>
                      </div>
                    )}
                  </div>
                  <div className="guidance-actions-mg">
                    {selectedGuidance.status === 'pending' && (
                      <button
                        className="respond-button-mg"
                        onClick={() => toggleExpanded(selectedGuidance._id)}
                      >
                        <Send size={16} />
                        {expandedItem === selectedGuidance._id ? 'Cancel' : 'Send Response'}
                      </button>
                    )}
                  </div>
                  {expandedItem === selectedGuidance._id && (
                    <div className="response-form-mg">
                      <div className="form-field-mg">
                        <label className="form-label-mg">Mentor Name:</label>
                        <input
                          type="text"
                          value={mentorName}
                          onChange={(e) => setMentorName(e.target.value)}
                          placeholder="Enter your name as mentor..."
                          className="mentor-name-input-mg"
                        />
                      </div>
                      <div className="form-field-mg">
                        <label className="form-label-mg">Response:</label>
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your guidance response here..."
                          className="response-textarea-mg"
                          rows="4"
                        />
                      </div>
                      {error && (
                        <div className="form-error-mg">
                          ⚠️ {error}
                        </div>
                      )}
                      <div className="form-actions-mg">
                        <button
                          onClick={() => handleSendResponse(selectedGuidance._id)}
                          disabled={!responseText.trim() || !mentorName.trim() || submitting}
                          className="submit-response-button-mg"
                        >
                          {submitting ? (
                            <div className="button-spinner-mg"></div>
                          ) : (
                            <Send size={16} />
                          )}
                          {submitting ? 'Submitting Response...' : 'Submit Response'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* All guidances list */}
            {!selectedGuidance && (
              <>
                {loading ? (
                  <div className="loading-container-mg">
                    <div className="loading-spinner-mg"></div>
                    <p className="loading-text-mg">Loading guidance requests...</p>
                  </div>
                ) : error ? (
                  <div className="error-container-mg">
                    <p className="error-text-mg">⚠️ Error: {error}</p>
                  </div>
                ) : data.length > 0 ? (
                  <div className="guidance-grid-mg">
                    {data.map((item) => (
                      <div key={item._id} className="mentor-guidance-item-mg">
                        <div className="guidance-header-mg">
                          <div className="guidance-title-section-mg">
                            <h2 className="guidance-title-mg">{item.guidanceTitle}</h2>
                            <span className={`status-badge-mg ${item.status}`}>
                              {item.status === 'pending' ? (
                                <Clock size={14} />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="guidance-body-mg">
                          <p className="guidance-description-mg">{item.guidanceDiscription}</p>
      
                          <div className="guidance-meta-mg">
                            <div className="meta-item-mg">
                              <User size={16} />
                              <span>Student: {item.studentGName || 'Anonymous'}</span>
                            </div>
                            <div className="meta-item-mg">
                              <User size={16} />
                              <span>Mentor: {item.mentorName}</span>
                            </div>
                            <div className="meta-item-mg">
                              <Clock size={16} />
                              <span>Created: {formatDate(item.guidanceDate)}</span>
                            </div>
                            {item.responseDate && item.response !== "No response yet" && (
                              <div className="meta-item-mg">
                                <Clock size={16} />
                                <span>Responded: {formatDate(item.responseDate)}</span>
                              </div>
                            )}
                          </div>
                          {item.response && item.response !== "No response yet" && (
                            <div className="response-section-mg">
                              <h4 className="response-label-mg">Response:</h4>
                              <p className="response-text-mg">{item.response}</p>
                            </div>
                          )}
                        </div>
                        <div className="guidance-actions-mg">
                          {item.status === 'pending' && (
                            <button
                              className="respond-button-mg"
                              onClick={() => toggleExpanded(item._id)}
                            >
                              <Send size={16} />
                              {expandedItem === item._id ? 'Cancel' : 'Send Response'}
                            </button>
                          )}
                        </div>
                        {expandedItem === item._id && (
                          <div className="response-form-mg">
                            <div className="form-field-mg">
                              <label className="form-label-mg">Mentor Name:</label>
                              <input
                                type="text"
                                value={mentorName}
                                onChange={(e) => setMentorName(e.target.value)}
                                placeholder="Enter your name as mentor..."
                                className="mentor-name-input-mg"
                              />
                            </div>
                            <div className="form-field-mg">
                              <label className="form-label-mg">Response:</label>
                              <textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Type your guidance response here..."
                                className="response-textarea-mg"
                                rows="4"
                              />
                            </div>
                            {error && (
                              <div className="form-error-mg">
                                ⚠️ {error}
                              </div>
                            )}
                            <div className="form-actions-mg">
                              <button
                                onClick={() => handleSendResponse(item._id)}
                                disabled={!responseText.trim() || !mentorName.trim() || submitting}
                                className="submit-response-button-mg"
                              >
                                {submitting ? (
                                  <div className="button-spinner-mg"></div>
                                ) : (
                                  <Send size={16} />
                                )}
                                {submitting ? 'Submitting Response...' : 'Submit Response'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-mg">
                    <MessageCircle size={48} />
                    <h3>No Guidance Requests</h3>
                    <p>There are currently no guidance requests to display.</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mentor-guidance-footer-mg">
            <p>💡 For technical support, please contact the system administrator.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorGuidance;