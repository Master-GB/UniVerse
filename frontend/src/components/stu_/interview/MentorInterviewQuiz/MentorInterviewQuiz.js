import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./MentorInterviewQuiz.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/interview-quizzes";

const JOB_TYPES = ["Intern", "Full-time", "Part-time", "Freelance"];

function MentorInterviewQuiz() {
  const [facultyName, setFacultyName] = useState("Computing");
  const [roleName, setRoleName] = useState(""); // admin types role
  const [jobType, setJobType] = useState("");   // NEW: job type
  const [questionsList, setQuestionsList] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  const [message, setMessage] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [editing, setEditing] = useState(null); // { faculty, role, qIndex }

  // Table quick filters (unique idea for pro UX)
  const [filterFaculty, setFilterFaculty] = useState("All");
  const [filterJobType, setFilterJobType] = useState("All");
  const [searchRole, setSearchRole] = useState("");

  // ---------- Data ----------
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(API_URL);
      setQuizzes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch quizzes", err.message);
      setMessage("❌ Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // ---------- Form handlers ----------
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questionsList];
    if (field === "questionText" || field === "correctAnswer") {
      updated[index][field] = value;
    } else if (field.startsWith("option")) {
      const optIndex = parseInt(field.slice(-1), 10);
      updated[index].options[optIndex] = value;
    }
    setQuestionsList(updated);
  };

  const addQuestionField = () => {
    setQuestionsList([
      ...questionsList,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestionField = (idx) => {
    setQuestionsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setRoleName("");
    setJobType("");
    setQuestionsList([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!roleName.trim()) {
      setMessage("❌ Please enter a Role name.");
      return;
    }
    if (!jobType) {
      setMessage("❌ Please select a Job Type.");
      return;
    }

    try {
      if (editing) {
        // update the single question being edited by replacing it in the array
        const { faculty, role, qIndex } = editing;
        // fetch the role’s current questions (defensive: we’ll trust the table but re-pull on server via PUT)
        const facultyDoc = quizzes.find((f) => f.facultyName === faculty);
        const roleData = facultyDoc?.roles.find((r) => r.roleName === role);
        if (!roleData) throw new Error("Role not found while editing.");

        const updatedQuestions = [...roleData.questions];
        updatedQuestions[qIndex] = questionsList[0];

        // Update questions
        await axios.put(
          `${API_URL}/${encodeURIComponent(faculty)}/${encodeURIComponent(role)}`,
          { questions: updatedQuestions, jobType } // allow jobType update on edit
        );

        setMessage("✅ Question updated successfully!");
      } else {
        // Add all new questions, one by one (keeps API unchanged & simple)
        for (const q of questionsList) {
          const payload = { facultyName, roleName, jobType, question: q };
          await axios.post(API_URL, payload);
        }
        setMessage("✅ Questions added successfully!");
      }

      resetForm();
      fetchQuizzes();
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (faculty, role, qIndex) => {
    const facultyDoc = quizzes.find((f) => f.facultyName === faculty);
    const roleData = facultyDoc?.roles.find((r) => r.roleName === role);
    if (!roleData) return;

    const q = roleData.questions[qIndex];
    setFacultyName(faculty);
    setRoleName(role);
    setJobType(roleData.jobType || ""); // populate current jobType if present
    setQuestionsList([q]);
    setEditing({ faculty, role, qIndex });
    setMessage("");
  };

  // NEW: precise delete endpoint (delete a single question by index)
  const handleDelete = async (faculty, role, qIndex) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(
        `${API_URL}/${encodeURIComponent(faculty)}/${encodeURIComponent(role)}/${qIndex}`
      );
      setMessage("✅ Question deleted successfully!");
      fetchQuizzes();
    } catch (err) {
      setMessage("❌ Error deleting question: " + (err.response?.data?.message || err.message));
    }
  };

  // ---------- Table data (global view) ----------
  const allRows = useMemo(() => {
    return quizzes.flatMap((faculty) =>
      faculty.roles.flatMap((role) =>
        role.questions.map((q, idx) => ({
          facultyName: faculty.facultyName,
          roleName: role.roleName,
          jobType: role.jobType || "—",
          qIndex: idx,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
        }))
      )
    );
  }, [quizzes]);

  const facultyOptions = useMemo(() => {
    const set = new Set(quizzes.map((f) => f.facultyName));
    return ["All", ...Array.from(set)];
  }, [quizzes]);

  const filteredRows = useMemo(() => {
    return allRows.filter((r) => {
      if (filterFaculty !== "All" && r.facultyName !== filterFaculty) return false;
      if (filterJobType !== "All" && r.jobType !== filterJobType) return false;
      if (searchRole && !r.roleName.toLowerCase().includes(searchRole.toLowerCase())) return false;
      return true;
    });
  }, [allRows, filterFaculty, filterJobType, searchRole]);

  const badge = (type) => (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: 12,
        background: "#eef2ff",
        border: "1px solid #dbeafe",
      }}
      title={type}
    >
      {type}
    </span>
  );

  return (
    <div className="mentor-container-IQ">
      <h2 className="mentor-title-IQ">Interview Quiz (Admin)</h2>

      {/* Add / Edit Form */}
      <form className="mentor-form-IQ" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label>Faculty</label>
            <select value={facultyName} onChange={(e) => setFacultyName(e.target.value)}>
              <option value="Computing">Computing</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          <div className="col">
            <label>Role (type)</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="col">
            <label>Job Type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
              <option value="">Select Job Type</option>
              {JOB_TYPES.map((jt) => (
                <option key={jt} value={jt}>{jt}</option>
              ))}
            </select>
          </div>
        </div>

        {questionsList.map((q, idx) => (
          <div key={idx} className="question-block">
            <div className="question-block-header">
              <h4>Question {idx + 1}</h4>
              {questionsList.length > 1 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeQuestionField(idx)}
                  title="Remove this question"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Question Text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
              required
            />

            <div className="options-grid">
              {q.options.map((opt, oIdx) => (
                <input
                  key={oIdx}
                  type="text"
                  placeholder={`Option ${oIdx + 1}`}
                  value={opt}
                  onChange={(e) => handleQuestionChange(idx, `option${oIdx}`, e.target.value)}
                  required
                />
              ))}
            </div>

            <input
              type="text"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
              required
            />
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={addQuestionField}>
            + Add Another Question
          </button>
          <div>
            {editing && (
              <button type="button" className="btn-light" onClick={resetForm} style={{ marginRight: 8 }}>
                Cancel Edit
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editing ? "Update Question" : "Submit All Questions"}
            </button>
          </div>
        </div>
      </form>

      {message && <p className="mentor-msg-IQ">{message}</p>}

      {/* Manage Questions Table (Global) */}
      <div className="table-header">
        <h3 className="mentor-title-IQ">Manage All Questions</h3>

        {/* Quick filters (unique idea) */}
        <div className="filters-row">
          <select value={filterFaculty} onChange={(e) => setFilterFaculty(e.target.value)}>
            {facultyOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select value={filterJobType} onChange={(e) => setFilterJobType(e.target.value)}>
            {["All", ...JOB_TYPES].map((jt) => (
              <option key={jt} value={jt}>{jt}</option>
            ))}
          </select>

          <input
            type="text"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            placeholder="Search role…"
          />
        </div>
      </div>

      <table className="mentor-table-IQ">
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Role</th>
            <th>Job Type</th>
            <th>Question</th>
            <th>Options</th>
            <th>Correct Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row, i) => (
              <tr key={`${row.facultyName}-${row.roleName}-${row.qIndex}-${i}`}>
                <td>{row.facultyName}</td>
                <td>{row.roleName}</td>
                <td>{badge(row.jobType)}</td>
                <td>{row.questionText}</td>
                <td>{row.options.join(", ")}</td>
                <td>{row.correctAnswer}</td>
                <td>
                  <button
                    className="btn-small"
                    onClick={() => handleEdit(row.facultyName, row.roleName, row.qIndex)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-small btn-danger"
                    style={{ marginLeft: 6 }}
                    onClick={() => handleDelete(row.facultyName, row.roleName, row.qIndex)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" style={{ textAlign: "center" }}>No questions found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MentorInterviewQuiz;
