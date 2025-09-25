import React, { useState } from "react";
import axios from "axios";
import "./stu_MentorInterviewQuiz.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/interviewquiz";

const StuMentorInterviewQuiz = () => {
  const faculties = ["Computing", "Business", "Engineering"];
  const jobTypes = ["Part-Time", "Full-Time", "Intern"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const [formData, setFormData] = useState({
    facultyName: "",
    roleName: "",
    jobType: "",
  });

  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "" }
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (idx, field, value, optionIdx = null) => {
    const newQuestions = [...questions];
    if (field === "option") {
      newQuestions[idx].options[optionIdx] = value;
    } else {
      newQuestions[idx][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "" }]);
    } else {
      alert("You can add up to 10 questions at a time.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let q of questions) {
        if (!q.questionText || !q.correctAnswer || q.options.includes("") || !q.difficulty) {
          setMessage("❌ Please fill all fields for all questions.");
          setLoading(false);
          return;
        }
      }

      for (let q of questions) {
        const payload = {
          facultyName: formData.facultyName,
          roleName: formData.roleName,
          jobType: formData.jobType,
          question: q
        };
        await axios.post(API_URL, payload);
      }

      setMessage("✅ All questions added successfully!");
      setFormData({ facultyName: "", roleName: "", jobType: "" });
      setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "" }]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stu-mentorinterview-container">
      <header className="stu-mentorinterview-header">
        <h2>Mentor Interview – Add Questions</h2>
      </header>

      <form className="stu-mentorinterview-form" onSubmit={handleSubmit}>
        {/* Faculty */}
        <div className="stu-mentorinterview-row">
          <label>Faculty:</label>
          <select name="facultyName" value={formData.facultyName} onChange={handleFormChange} required>
            <option value="">-- Select Faculty --</option>
            {faculties.map((fac, idx) => <option key={idx} value={fac}>{fac}</option>)}
          </select>
        </div>

        {/* Role */}
        <div className="stu-mentorinterview-row">
          <label>Role:</label>
          <input type="text" name="roleName" value={formData.roleName} onChange={handleFormChange} placeholder="Enter role name" required />
        </div>

        {/* Job Type */}
        <div className="stu-mentorinterview-row">
          <label>Job Type:</label>
          <select name="jobType" value={formData.jobType} onChange={handleFormChange} required>
            <option value="">-- Select Job Type --</option>
            {jobTypes.map((job, idx) => <option key={idx} value={job}>{job}</option>)}
          </select>
        </div>

        {/* Questions */}
        {questions.map((q, idx) => (
          <div key={idx} style={{ borderTop: "1px solid #6a1e55", marginTop: "20px", paddingTop: "15px" }}>
            <h4>Question {idx + 1}</h4>

            <div className="stu-mentorinterview-row">
              <label>Difficulty:</label>
              <select value={q.difficulty} onChange={(e) => handleQuestionChange(idx, "difficulty", e.target.value)} required>
                <option value="">-- Select Difficulty --</option>
                {difficulties.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="stu-mentorinterview-row">
              <label>Question Text:</label>
              <textarea value={q.questionText} onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)} required />
            </div>

            <div className="stu-mentorinterview-row">
              <label>Options:</label>
              <div className="stu-mentorinterview-options">
                {q.options.map((opt, optionIdx) => (
                  <div key={optionIdx}>
                    <label>Option {optionIdx + 1}:</label>
                    <input type="text" value={opt} onChange={(e) => handleQuestionChange(idx, "option", e.target.value, optionIdx)} required />
                  </div>
                ))}
              </div>
            </div>

            <div className="stu-mentorinterview-row">
              <label>Correct Answer:</label>
              <input type="text" value={q.correctAnswer} onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)} required />
            </div>
          </div>
        ))}

        {/* Add question button */}
        {questions.length < 10 && (
          <div className="stu-mentorinterview-row">
            <button type="button" onClick={addQuestion}>➕ Add Another Question</button>
          </div>
        )}

        {/* Submit */}
        <div className="stu-mentorinterview-row" style={{ marginTop: "20px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Saving..." : "💾 Save All Questions"}
          </button>
        </div>
      </form>

      {message && <p className="stu-mentorinterview-message">{message}</p>}
    </div>
  );
};

export default StuMentorInterviewQuiz;
