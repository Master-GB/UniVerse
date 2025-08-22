import React, { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

// TEMP: sample data; replace with your API data later
const sampleArticles = [
  {
    id: "1",
    title: "Next.js 15 released with Partial Prerendering",
    excerpt:
      "The latest Next.js release brings performance gains and a simplified data fetching model.",
    category: "Tech News",
    author: "Vercel Team",
    publishedAt: "2025-08-18T09:00:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Prompt Engineering: Practical Patterns",
    excerpt:
      "A set of actionable patterns to design reliable LLM prompts for production systems.",
    category: "AI",
    author: "Jane Park",
    publishedAt: "2025-08-15T08:00:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Best Tools for Frontend Devs in 2025",
    excerpt:
      "From build tools to component libraries—what’s worth your time this year.",
    category: "Tools",
    author: "Alex Chen",
    publishedAt: "2025-08-12T10:15:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Choosing a Tech Stack for Scale",
    excerpt:
      "How to evaluate your tech stack based on team, product stage, and growth plans.",
    category: "Tech Stack",
    author: "Priya Singh",
    publishedAt: "2025-08-10T13:30:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Modern Web Performance Playbook",
    excerpt:
      "Optimizing Core Web Vitals with a systematic approach for 2025 web standards.",
    category: "Web",
    author: "Google Web DevRel",
    publishedAt: "2025-08-20T07:30:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Zero-to-One: Founder Mindset",
    excerpt:
      "Mindset shifts for engineers stepping into entrepreneurship and early traction.",
    category: "Entrepreneurship",
    author: "Sam Patel",
    publishedAt: "2025-08-05T11:45:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "7",
    title: "Platform Engineering: Golden Paths",
    excerpt:
      "Create golden paths and reduce cognitive load for product teams using IDPs.",
    category: "Engineering",
    author: "DevEx Guild",
    publishedAt: "2025-08-19T16:10:00.000Z",
    coverImg:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1600&auto=format&fit=crop",
  },
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

export default function StuArticales() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Replace this with your API call when ready
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Example API pattern:
        // const res = await axios.get('http://localhost:8070/articles');
        // setArticles(res.data);
        await new Promise((r) => setTimeout(r, 400)); // small UX delay
        if (mounted) setArticles(sampleArticles);
      } catch (e) {
        if (mounted) setError("Failed to load articles. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = articles.filter((a) => {
      const matchCategory =
        activeCategory === "All" || a.category === activeCategory;
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });

    list.sort((a, b) => {
      const ad = new Date(a.publishedAt).getTime();
      const bd = new Date(b.publishedAt).getTime();
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
              key={a.id}
              className="article-card"
              onClick={() => navigate(`/student/articales/${a.id}`)}
              style={{ cursor: "pointer" }}
            >
              {a.coverImg && (
                <div className="cover">
                  <img src={a.coverImg} alt={a.title} loading="lazy" />
                </div>
              )}
              <div className="content">
                <div className="badge">{a.category}</div>
                <h3 className="title">{a.title}</h3>
                <p className="excerpt">{a.excerpt}</p>
                <div className="meta">
                  <span className="author">{a.author}</span>
                  <span className="dot">•</span>
                  <span className="date">{formatDate(a.publishedAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}