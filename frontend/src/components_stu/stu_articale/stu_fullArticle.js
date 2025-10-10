import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";
import "./stu_fullArticle.css";

export default function FullArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `http://localhost:8070/mentor-article/getid/${id}`
        );

        // The backend now returns article inside response.data.article
        setArticle(response.data.article);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          err.response?.data?.message || "Failed to fetch article. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageSrc = () => {
    if (!article?.article_image) return null;

    // article_image is base64 string from backend
    return article.article_image;
  };

  if (loading) {
    return <div className="article-loading">Loading article...</div>;
  }

  if (error) {
    return <div className="article-not-found">{error}</div>;
  }

  if (!article) {
    return <div className="article-not-found">Article not found</div>;
  }

  return (
    <div className="article-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Articles
        </button>
      <div className="article-container">
        

        <article className="article-content">
          <header className="article-header">
            <div className="article-meta">
              <span className="article-category">{article.article_category}</span>
              <span className="article-date">{formatDate(article.article_date)}</span>
              {article.article_duration && (
                <span className="article-read-time">{article.article_duration} min read</span>
              )}
            </div>
            <h1 className="article-title">{article.article_title}</h1>
            <div className="article-author">By {article.article_author}</div>
          </header>

          {getImageSrc() && (
            <div className="article-cover">
              <img src={getImageSrc()} alt={article.article_title} />
            </div>
          )}

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.article_description }}
          />
        </article>
      </div>
    </div>
  );
}
