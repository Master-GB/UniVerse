import React, { useEffect, useMemo, useState } from "react";
import "./stu_resources.css";

const API_BASE = "http://localhost:8070";
const ENDPOINT = `${API_BASE}/resource/display`;

const MAIN_TABS = ["Overview", "All", "Computing", "Business", "Engineering"];
const TYPES = ["LectureVideo", "LectureNote", "PastPaper", "Paper", "Other"];

const PAGE_SIZE = 12;



function useFavorites() {
  const KEY = "universe_resource_favorites";
  const [favSet, setFavSet] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(Array.from(favSet)));
  }, [favSet]);

  const toggleFav = (id) => {
    setFavSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFav = (id) => favSet.has(id);
  return { favSet, toggleFav, isFav };
}

function ResourceCard({ item, onPreview, onOpen, isFavorite, onToggleFav }) {
  const badgeColor = {
    LectureVideo: "#3b82f6",
    LectureNote: "#22c55e",
    PastPapper: "#a855f7",
    Papper: "#f59e0b",
    Other: "#64748b",
  }[item.typeOfRes] || "#6b7280";

  return (
    <div className="res-card">
      <div className="res-thumb">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} />
        ) : (
          <div className="res-thumb-fallback">{item.typeOfRes?.[0] || "R"}</div>
        )}
      </div>

      <div className="res-body">
        <div className="res-topline">
          <span className="res-type" style={{ backgroundColor: badgeColor }}>
            {item.typeOfRes}
          </span>
          <button
            className={`res-fav ${isFavorite ? "active" : ""}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={() => onToggleFav(item._id)}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>

        <h4 className="res-title" title={item.title}>
          {item.title}
        </h4>
        <p className="res-desc">{item.description}</p>

        <div className="res-meta">
          <span>{item.category}</span>
          {item.sub_category ? <span>• {item.sub_category}</span> : null}
          {item.contentType ? <span>• {item.contentType.toUpperCase()}</span> : null}
        </div>

        <div className="res-actions">
          <button className="btn ghost" onClick={() => onPreview(item)}>
            Preview
          </button>
          <button className="btn" onClick={() => onOpen(item)}>
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ item, onClose }) {
  if (!item) return null;

  const isVideo = item.contentType?.toLowerCase() === "mp4";
  const isPdf = item.contentType?.toLowerCase() === "pdf";
  const isLink = item.contentType?.toLowerCase() === "link";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item.title}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          {isVideo && (
            <video controls style={{ width: "100%", height: "100%" }}>
              <source src={item.fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {isPdf && (
            <embed
              src={item.fileUrl}
              type="application/pdf"
              className="pdf-embed"
            />
          )}
          {isLink && (
            <div className="link-preview">
              <p>This resource is a link.</p>
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn">
                Open Link
              </a>
            </div>
          )}
          {!isVideo && !isPdf && !isLink && (
            <div className="fallback-preview">
              <p>Preview not available for this content type.</p>
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn">
                Open Resource
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StuResources() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");
  const [subCatFilter, setSubCatFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated_desc"); // updated_desc | updated_asc | title_asc | title_desc
  const [page, setPage] = useState(1);
  const [showFavOnly, setShowFavOnly] = useState(false);

  const [previewItem, setPreviewItem] = useState(null);
  const { favSet, toggleFav, isFav } = useFavorites();

 
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    fetch(ENDPOINT)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        const arr = Array.isArray(data?.resources) ? data.resources : [];
        // Normalize minimal fields; fallback to dummy if empty
        if (arr.length === 0) {
           console.log("No resources from API, using dummy data.");
        } else {
          setResources(
            arr.map((x, i) => ({
              _id: x._id || `db-${i}`,
              title: x.title || "Untitled",
              description: x.description || "",
              category: x.category || "Computing",
              sub_category: x.sub_category || "General",
              typeOfRes: x.typeOfRes || "Other",
              contentType: x.contentType || "link",
              fileUrl: x.fileUrl || "#",
              thumbnailUrl: x.thumbnailUrl || "",
              updatedAt: x.updatedAt || new Date().toISOString(),
            }))
          );
        }
      })
      .catch(() => {
        if (!mounted) return;
        console.log("Failed to fetch resources, using dummy data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Derived options
  const availableSubCats = useMemo(() => {
    const byTab = (r) =>
      activeTab === "All" || activeTab === "Overview"
        ? true
        : r.category?.toLowerCase() === activeTab.toLowerCase();
    const set = new Set(
      resources.filter(byTab).map((r) => r.sub_category || "General")
    );
    return ["All", ...Array.from(set).sort()];
  }, [resources, activeTab]);

  // Filter pipeline
  const filtered = useMemo(() => {
    let arr = resources.slice();

    // Tab category filter
    if (activeTab !== "All" && activeTab !== "Overview") {
      arr = arr.filter(
        (r) => r.category?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Type filter
    if (typeFilter !== "All") {
      arr = arr.filter((r) => r.typeOfRes === typeFilter);
    }

    // Sub-category filter
    if (subCatFilter !== "All") {
      arr = arr.filter((r) => (r.sub_category || "General") === subCatFilter);
    }

    // Favorites filter
    if (showFavOnly) {
      arr = arr.filter((r) => favSet.has(r._id));
    }

    // Search by title
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((r) => r.title?.toLowerCase().includes(q));
    }

    // Sort
    arr.sort((a, b) => {
      if (sortBy === "updated_desc") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === "updated_asc") {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      } else if (sortBy === "title_desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      return 0;
    });

    return arr;
  }, [resources, activeTab, typeFilter, subCatFilter, query, sortBy, showFavOnly, favSet]);

  // Group by type for rendering inside sections
  const groupedByType = useMemo(() => {
    const m = new Map();
    TYPES.forEach((t) => m.set(t, []));
    filtered.forEach((r) => {
      if (!m.has(r.typeOfRes)) m.set(r.typeOfRes, []);
      m.get(r.typeOfRes).push(r);
    });
    return m;
  }, [filtered]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1); // reset pagination on filter changes
  }, [activeTab, typeFilter, subCatFilter, query, sortBy, showFavOnly]);

  const handleOpen = (item) => {
    if (item?.fileUrl) window.open(item.fileUrl, "_blank", "noopener,noreferrer");
  };

  const renderGrid = (items) => {
    if (loading) {
      return (
        <div className="res-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="res-card skeleton" />
          ))}
        </div>
      );
    }
    if (err) {
      return <div className="state error">Failed to load. Please try again.</div>;
    }
    if (items.length === 0) {
      return <div className="state empty">No resources found.</div>;
    }
    return (
      <>
        <div className="res-grid">
          {items.map((item) => (
            <ResourceCard
              key={item._id}
              item={item}
              onPreview={setPreviewItem}
              onOpen={handleOpen}
              isFavorite={isFav(item._id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
        <div className="pagination">
          <div className="pagination-buttons">
            <button
              className="btn ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="btn ghost"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
        </div>
      </>
    );
  };

  const overviewShowcase = useMemo(() => {
    // For Overview: show a small sample per type
    const blocks = TYPES.map((t) => {
      const list = groupedByType.get(t) || [];
      return { type: t, items: list.slice(0, 4) };
    });
    return blocks;
  }, [groupedByType]);

  return (
    <div className="stu-resources">
      <div className="tabs">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="tabs-spacer" />
        <label className="fav-toggle">
          <input
            type="checkbox"
            checked={showFavOnly}
            onChange={(e) => setShowFavOnly(e.target.checked)}
          />
          Favorites
        </label>
      </div>

      

      <div className="filters">
        <div className="filter-row">

          <div className="filter grow">
            <label>Search (title)</label>
            <input
              type="text"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="filter">
            <label>Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label>Sub Category</label>
            <select
              value={subCatFilter}
              onChange={(e) => setSubCatFilter(e.target.value)}
            >
              {availableSubCats.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>


          <div className="filter">
            <label>Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updated_desc">Updated date (newest)</option>
              <option value="updated_asc">Updated date (oldest)</option>
              <option value="title_asc">Title (A–Z)</option>
              <option value="title_desc">Title (Z–A)</option>
            </select>
          </div>
        </div>
      </div>

      {activeTab === "Overview" ? (
        <div className="overview">
          {overviewShowcase.map((blk) => (
            <div key={blk.type} className="overview-block">
              <div className="overview-header">
                <h3>{blk.type}</h3>
                <button
                  className="link-btn"
                  onClick={() => {
                    setActiveTab("All");
                    setTypeFilter(blk.type);
                  }}
                >
                  View all →
                </button>
              </div>
              <div className="res-grid">
                {blk.items.length === 0 ? (
                  <div className="state empty small">No items.</div>
                ) : (
                  blk.items.map((item) => (
                    <ResourceCard
                      key={item._id}
                      item={item}
                      onPreview={setPreviewItem}
                      onOpen={handleOpen}
                      isFavorite={isFav(item._id)}
                      onToggleFav={toggleFav}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        renderGrid(paginated)
      )}

      <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
}
