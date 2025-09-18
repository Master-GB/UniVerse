import React, { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";
import "./stu_articales.css";

const CATEGORIES = [
  "All",
  "Tech News",
  "AI",
  "Tools",
  "Tech Stack",
  "Web",
  "Entrepreneurship",
  "Engineering",
];

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

// Utility to strip HTML and truncate
function getExcerpt(html, wordLimit = 30) {
  const text = html.replace(/<[^>]+>/g, ""); // strip HTML tags
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + " ...";
}

export default function StuArticales() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:8070/mentor-article/display");

        const articlesData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.articles)
          ? res.data.articles
          : [];

        if (mounted) setArticles(articlesData);
      } catch (e) {
        console.error("Error fetching articles:", e);
        if (mounted) setError("Failed to load articles. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchArticles();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(articles)) return [];

    const q = searchQuery.trim().toLowerCase();
    let list = articles.filter((a) => {
      const matchCategory =
        activeCategory === "All" || a.article_category === activeCategory;

      const matchSearch =
        !q ||
        (a.article_title && a.article_title.toLowerCase().includes(q)) ||
        (a.article_description && a.article_description.toLowerCase().includes(q)) ||
        (a.article_author && a.article_author.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });

    list.sort((a, b) => {
      const ad = new Date(a.article_date).getTime();
      const bd = new Date(b.article_date).getTime();
      return sortBy === "newest" ? bd - ad : ad - bd;
    });

    return list;
  }, [articles, activeCategory, searchQuery, sortBy]);

  return (
    <div className="articles-wrapper">
      <div className="articles-header">
        <div className="title">
          <h1>Articles</h1>
          <p className="subtitle">
            Explore curated content across engineering and tech. Filter by
            category and sort by publish date.
          </p>
        </div>

        <div className="controls">
          <div className="search">
            <Search size={18} className="icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sort">
            <Filter size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort by publish date"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="category-pills">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`pill ${activeCategory === c ? "active" : ""}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="articles-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="article-card skeleton">
              <div className="cover" />
              <div className="content">
                <div className="badge" />
                <div className="line line-1" />
                <div className="line line-2" />
                <div className="meta" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No articles found. Try a different category or search.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filtered.map((a) => (
            <article
              key={a._id || a.id}
              className="article-card"
              onClick={() => navigate(`/student/articales/${a._id || a.id}`)}
              style={{ cursor: "pointer" }}
            >
              {a.article_image && (
                <div className="cover">
                  <img
                    src={`http://localhost:8070/mentor-article/image/${a._id}`}
                    alt={a.article_title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="content">
                <div className="badge">{a.article_category}</div>
                <h3 className="title">{a.article_title}</h3>
                <p className="excerpt">
                  {getExcerpt(a.article_description, 30)}{" "}
                  <span className="see-more">See more →</span>
                </p>
                <div className="meta">
                  <span className="author">{a.article_author}</span>
                  <span className="dot">•</span>
                  <span className="date">{formatDate(a.article_date)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
