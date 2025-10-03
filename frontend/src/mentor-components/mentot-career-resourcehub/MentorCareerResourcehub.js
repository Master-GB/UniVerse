import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ExternalLink,
  Clock,
  Star,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import Navbar from "../mentor-navbar/MentorNavbar";
import "./MentorCareerResourcehub.css";

export default function CareerResourcesPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "interview",
    category: "Interview Prep",
    url: "",
    actionText: "View Resource",
    level: "All Level",
    duration: "",
    premium: false,
  });

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchResources = useCallback(async () => {
    setFetchLoading(true);
    setError("");
    try {
      const res = await fetch(
        "http://localhost:8070/mentor-career-resource/display"
      );
      const data = await res.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load resources.");
      setResources([
        {
          _id: "demo-1",
          title: "Mock Interview Prep Guide",
          description: "Comprehensive guide for technical interviews",
          type: "interview",
          category: "Interview Prep",
          url: "https://example.com",
          actionText: "View Guide",
          level: "All Level",
          duration: "45 mins",
          premium: false,
        },
      ]);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!form.title || !form.description || !form.category || !form.url) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8070/mentor-career-resource/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed");
      await fetchResources();
      setForm({
        title: "",
        description: "",
        type: "interview",
        category: "Interview Prep",
        url: "",
        actionText: "View Resource",
        level: "All Level",
        duration: "",
        premium: false,
      });
      setSuccess("Resource added successfully!");
      setShowForm(false);
    } catch {
      setError("API unavailable, added locally.");
      setResources((prev) => [{ _id: Date.now(), ...form }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "professional":
        return "🎥";
      case "interview":
        return "💼";
      case "skill":
        return "🎯";
      case "salary":
        return "💰";
      case "company":
        return "🏢";
      default:
        return "📄";
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      professional: "Professional Skills",
      interview: "Interview Prep",
      skill: "Skill Development",
      salary: "Salary Data",
      company: "Company Insights"
    };
    return labels[type] || type;
  };

  return (
    <div className="careerR-page">
      <Navbar />
      <div className="careerR-container">
        <div className="careerR-header">
          <h1>Career Resources Hub</h1>
          <p>Curate and manage career development resources for your mentees</p>
          <button
            className="careerR-add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} />
            {showForm ? "Cancel" : "Add New Resource"}
          </button>
        </div>

        {error && (
          <div className="careerR-alert careerR-error">
            <AlertCircle size={20} /> {error}
          </div>
        )}
        {success && (
          <div className="careerR-alert careerR-success">
            <Star size={20} /> {success}
          </div>
        )}

        {showForm && (
          <div className="careerR-form-card">
            <h2>Add New Resource</h2>
            <div className="careerR-form-grid">
              <input
                type="text"
                name="title"
                placeholder="Title *"
                value={form.title}
                onChange={handleChange}
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Interview Prep">Interview Prep</option>
                <option value="Salary data">Salary data</option>
                <option value="Skill Development">Skill Development</option>
                <option value="Company Insights">Company Insights</option>
                <option value="Professional Skill">Professional Skill</option>
              </select>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="interview">Interview</option>
                <option value="salary">Salary</option>
                <option value="skill">Skill</option>
                <option value="company">Company</option>
                <option value="professional">Professional</option>
              </select>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
              >
                <option value="All Level">All Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Mid-Senior">Mid-Senior</option>
                <option value="Senior">Senior</option>
              </select>
              <input
                type="url"
                name="url"
                placeholder="URL *"
                value={form.url}
                onChange={handleChange}
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g., 30 mins)"
                value={form.duration}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="description"
              placeholder="Description *"
              rows="4"
              value={form.description}
              onChange={handleChange}
            ></textarea>
            <div className="careerR-checkbox">
              <input
                type="checkbox"
                name="premium"
                checked={form.premium}
                onChange={handleChange}
              />
              <label>⭐ Premium Resource</label>
            </div>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Resource"}
            </button>
          </div>
        )}

        <div className="careerR-search-filter">
          <div className="careerR-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="careerR-filter-box">
            <Filter size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="interview">Interview</option>
              <option value="salary">Salary</option>
              <option value="skill">Skill</option>
              <option value="company">Company</option>
              <option value="professional">Professional</option>
            </select>
          </div>
        </div>

        {fetchLoading ? (
          <div className="careerR-loading">Loading resources...</div>
        ) : (
          <div className="careerR-grid">
            {filteredResources.length === 0 ? (
              <div className="careerR-empty">No resources found.</div>
            ) : (
              filteredResources.map((r) => (
                <div className="careerR-card" key={r._id}>
                  {r.premium && (
                    <div className="careerR-premium-badge">⭐ Premium</div>
                  )}
                  <div className="careerR-card-header">
                    <div className="careerR-icon">{getTypeIcon(r.type)}</div>
                    <div>
                      <h3>{r.title}</h3>
                      <span className="careerR-type">{getTypeLabel(r.type)}</span>
                    </div>
                  </div>
                  <p>{r.description}</p>
                  <div className="careerR-meta">
                    <span>📁 {r.category}</span>
                    {r.level && (
                      <span>📊 {r.level}</span>
                    )}
                    {r.duration && (
                      <span>
                        <Clock size={12} /> {r.duration}
                      </span>
                    )}
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="careerR-view-btn"
                  >
                    <ExternalLink size={16} /> {r.actionText}
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}