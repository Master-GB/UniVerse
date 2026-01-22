import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./stu_CourseQuiz.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function CourseQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseAndQuestions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/courses/getid/${id}`);
        setCourse(res.data);
        setQuestions(Array.isArray(res.data.questions) ? res.data.questions : []);
        setError("");
      } catch (err) {
        setError("Error loading course or questions: " + (err.response?.data?.message || err.message));
      }
    };
    fetchCourseAndQuestions();
  }, [id]);

  const handleNext = () => {
    if (!selectedOption) return alert("Please select an option");
    const current = questions[currentIndex];
    if (selectedOption === current.correctAnswer) setScore(prev => prev + 1);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption("");
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption("");
    }
  };

  const downloadCertificate = () => {
    const input = document.getElementById("certificate");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("certificate.pdf");
    });
  };

  if (error) return <div className="error-CourseQuiz">{error}</div>;
  if (!course) return <div className="loading-CourseQuiz">Loading course...</div>;

  if (completed) {
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <div className="container-CourseQuiz">
        <button 
          className="back-btn" 
          onClick={() => navigate("/student/courses")}
        >
          Back to Course
        </button>
        <h2 className="course-title-CourseQuiz">Quiz Results</h2>
        <h3 className="course-name-CourseQuiz">{course.coursename || "Computing Fundamentals"}</h3>

        <div className="quiz-block-CourseQuiz">
          <p className="quiz-result-CourseQuiz">
            Your Score: {score} / {totalQuestions} ({percentage}%)
          </p>

          {passed ? (
            <>

              <div id="certificate" className="quiz-certificate-CourseQuiz">
                <div className="cert-container">
                  <h1 className="cert-title">Certificate of Achievement</h1>
                  <p className="cert-sub">This certificate is proudly presented to</p>
                  <h2 className="student-name">Gihan Bandara</h2>
                  <p className="cert-text">For successfully completing the course</p>
                  <h3 className="course-name">{course.coursename || "Computing Fundamentals"}</h3>
                  <p className="cert-date">Date of Issue: {new Date().toLocaleDateString()}</p>
                  <p className="cert-footer">Congratulations on your outstanding achievement!</p>
                </div>
              </div>

               <button className="download-btn" onClick={downloadCertificate}>
                Download Certificate
              </button>
            </>
          ) : (
            <p className="fail-message">
              Sorry, you need at least 70% to earn a certificate. Try again!
            </p>
          )}

          <div >
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container-CourseQuiz">
      <h2 className="course-title-CourseQuiz">Course Quiz</h2>
      <h3 className="course-name-CourseQuiz">{course.coursename}</h3>
      {questions.length ? (
        <div className="quiz-block-CourseQuiz">
          <p className="quiz-question-CourseQuiz">
            Q{currentIndex + 1}: {currentQuestion?.questionText || "No question available"}
          </p>
          <div className="quiz-options-CourseQuiz">
            {Array.isArray(currentQuestion?.options) && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((opt, idx) => (
                <label key={idx} className="option-label-CourseQuiz">
                  <input
                    type="radio"
                    name="option"
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={() => setSelectedOption(opt)}
                    className="option-input-CourseQuiz"
                  />
                  {opt}
                </label>
              ))
            ) : (
              <p className="no-options-CourseQuiz">No options available for this question.</p>
            )}
          </div>
          <div className="quiz-actions-CourseQuiz">
            <button
              className="course-btn-CourseQuiz"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button className="course-btn-CourseQuiz" onClick={handleNext}>
              {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <p className="no-questions-CourseQuiz">No questions available for this course.</p>
      )}
    </div>
  );
}

export default CourseQuiz;