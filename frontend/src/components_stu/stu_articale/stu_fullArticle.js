import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./stu_fullArticle.css";

// This would come from your API in a real app
const sampleArticle = {
  id: "1",
  title: "Next.js 15 released with Partial Prerendering",
  excerpt: "The latest Next.js release brings performance gains and a simplified data fetching model.",
  content: `
    <h2>Introduction</h2>
    <p>Next.js 15 introduces Partial Prerendering, a new way to optimize your applications by combining the best of static site generation and server-side rendering. This feature allows you to serve static content quickly while still enabling dynamic interactions.</p>
    
    <h2>Key Features</h2>
    <ul>
      <li>Improved performance with faster page loads</li>
      <li>Simplified data fetching model</li>
      <li>Better developer experience</li>
      <li>Enhanced SEO capabilities</li>
    </ul>

    <h2>Getting Started</h2>
    <p>To get started with Next.js 15, update your project using npm or yarn:</p>
    <pre><code>npm install next@latest</code></pre>
    
    <p>Or with yarn:</p>
    <pre><code>yarn add next@latest</code></pre>
  `,
  category: "Tech News",
  author: "Vercel Team",
  publishedAt: "2025-08-18T09:00:00.000Z",
  coverImg: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
  readTime: 5
};

export default function FullArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the article by ID from your API
    const fetchArticle = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setArticle(sampleArticle);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="article-loading">
        <div className="skeleton-cover"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
        <div className="skeleton-content"></div>
        <div className="skeleton-content"></div>
        <div className="skeleton-content"></div>
      </div>
    );
  }

  if (!article) {
    return <div className="article-not-found">Article not found</div>;
  }

  return (
    <div className="article-wrapper">
      <div className="article-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Articles
        </button>
        
        <article className="article-content">
          <header className="article-header">
            <div className="article-meta">
              <span className="article-category">{article.category}</span>
              <span className="article-date">{formatDate(article.publishedAt)}</span>
              <span className="article-read-time">{article.readTime} min read</span>
            </div>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-author">By {article.author}</div>
          </header>

          {article.coverImg && (
            <div className="article-cover">
              <img src={article.coverImg} alt={article.title} />
            </div>
          )}

          <div 
            className="article-body" 
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
}
