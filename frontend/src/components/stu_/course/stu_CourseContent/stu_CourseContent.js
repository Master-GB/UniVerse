import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./stu_CourseContent.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function CourseContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/courses/${id}`);
        setCourse(res.data);
        setError("");
      } catch (err) {
        setError("Failed to load course: " + err.message);
        console.log("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleNextVideo = () => {
    setCompletedVideos(prev => [...new Set([...prev, currentVideoIndex])]);
    if (currentVideoIndex < course.videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const handleTakeQuiz = () => {
    navigate(`/courses/${id}/quiz`);
  };

  if (loading) return <p className="loading-coursecontent">Loading course content...</p>;
  if (error) return <p className="error-coursecontent">{error}</p>;
  if (!course) return <p className="not-found-coursecontent">Course not found.</p>;
  if (!course.videos || course.videos.length === 0)
    return <p className="not-found-coursecontent">No videos available for this course.</p>;

  return (
    <div className="course-details-page-coursecontent">
      <div className="sidebar-coursecontent">
        <h2>Course Overview</h2>
        <div className="sidebar-description-coursecontent">
          Explore a variety of courses designed to inspire learning and growth.
          Each course offers structured content, practical insights, and engaging activities
          to help you develop valuable skills and expand your knowledge at your own pace.
        </div>
        <h3>Video Lessons</h3>
        {course.videos.map((videoLink, index) => {
          const isActive = index === currentVideoIndex;
          const isCompleted = completedVideos.includes(index);
          return (
            <a
              key={index}
              href={`#video-${index}`}
              className={`video-link-coursecontent ${isActive ? "active-coursecontent" : ""} ${isCompleted ? "completed-coursecontent" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (index <= currentVideoIndex) setCurrentVideoIndex(index);
              }}
            >
              Video {index + 1} {isCompleted && "✅"}
            </a>
          );
        })}
      </div>

      <div className="course-content-section-coursecontent">
        <h1 className="course-details-title-coursecontent">
          {course.name} Course Content
        </h1>

        {course.videos.map((videoLink, index) => {
          let embedUrl = "";
          let isYouTube = false;

          if (videoLink.includes("youtube.com/watch")) {
            const urlParams = new URL(videoLink).searchParams;
            const videoId = urlParams.get("v");
            embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3`;
            isYouTube = true;
          } else if (videoLink.includes("youtu.be/")) {
            const videoId = videoLink.split("youtu.be/")[1].split("?")[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3`;
            isYouTube = true;
          } else {
            embedUrl = `${API_URL}/Uploads/${videoLink}`;
          }

          const isCompleted = completedVideos.includes(index);
          const isUnlocked = index <= currentVideoIndex;

          return (
            <div
              key={index}
              id={`video-${index}`}
              className={`course-page-coursecontent ${isCompleted ? "completed-coursecontent" : ""}`}
            >
              <h3>
                Video {index + 1} {isCompleted && "✅ Completed"}
              </h3>

              {isUnlocked ? (
                <>
                  <div className="video-wrapper-coursecontent">
                    {isYouTube ? (
                      <iframe
                        src={embedUrl}
                        title={`Video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => {
                          // auto-mark as completed for YouTube videos once opened
                          setCompletedVideos(prev => [...new Set([...prev, index])]);
                        }}
                      ></iframe>
                    ) : (
                      <video
                        controls
                        src={embedUrl}
                        onEnded={() => handleNextVideo()}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                  {index === currentVideoIndex && (
                    <div className="video-btns-coursecontent">
                      {currentVideoIndex > 0 && (
                        <button
                          className="course-btn-cou-coursecontent prev-btn-coursecontent"
                          onClick={() => setCurrentVideoIndex(prev => prev - 1)}
                        >
                          ◀ Previous
                        </button>
                      )}

                      {currentVideoIndex < course.videos.length - 1 ? (
                        <button
                          className="course-btn-cou-coursecontent next-btn-coursecontent"
                          onClick={handleNextVideo}
                        >
                          Next ▶
                        </button>
                      ) : (
                        <button
                          className="course-btn-cou-coursecontent"
                          onClick={handleTakeQuiz}
                        >
                          Take Quiz
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="locked-coursecontent"></p>
              )}
            </div>
          );
        })}

        <div className="details-buttons-coursecontent">
          <button
            className="course-btn-cou-coursecontent"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
