import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentInterviewQuiz.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070/api/interview-quizzes";

function StudentInterviewQuiz() {
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // 1️⃣ Fetch faculties + roles from backend
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get(`${API_URL}/faculties`);
        setFaculties(res.data);
        if (res.data.length > 0) setFaculty(res.data[0].facultyName);
      } catch (err) {
        console.error("Failed to fetch faculties:", err.message);
      }
    };
    fetchFaculties();
  }, []);

  // 2️⃣ Update roles when faculty changes
  useEffect(() => {
    if (!faculty) return;
    const selectedFaculty = faculties.find(f => f.facultyName === faculty);
    setRoles(selectedFaculty?.roles.map(r => r.roleName) || []);
    setRole("");
    setQuestions([]);
    setCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption("");
  }, [faculty, faculties]);

  // 3️⃣ Fetch questions when role selected
  useEffect(() => {
    if (!faculty || !role) return;

    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API_URL}/${faculty}/${role}`);
        setQuestions(res.data.questions || []);
        setCurrentIndex(0);
        setScore(0);
        setCompleted(false);
        setSelectedOption("");
      } catch (err) {
        console.error("Error fetching quiz:", err.response?.data || err.message);
        setQuestions([]);
      }
    };

    fetchQuestions();
  }, [faculty, role]);

  const handleNext = () => {
    if (!selectedOption) return alert("Please select an option");

    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption("");
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="student-container-IQ">
        <h2 className="student-title-IQ">Quiz Completed 🎉</h2>
        <p>Your Score: {score} / {questions.length} ({percentage.toFixed(0)}%)</p>
        {percentage >= 70 ? (
          <div className="student-badge-IQ">🏆 Badge: Interview Ready</div>
        ) : (
          <div className="student-badge-IQ">📘 Keep Practicing!</div>
        )}
      </div>
    );
  }

  return (
    <div className="student-container-IQ">
      <h2 className="student-title-IQ">Interview Quiz</h2>

      {/* Faculty Dropdown */}
      <label>Select Faculty:</label>
      <select value={faculty} onChange={e => setFaculty(e.target.value)}>
        {faculties.map(f => (
          <option key={f._id} value={f.facultyName}>{f.facultyName}</option>
        ))}
      </select>

      {/* Role Dropdown */}
      <label>Select Role:</label>
      <select value={role} onChange={e => setRole(e.target.value)} disabled={roles.length === 0}>
        <option value="">-- Select Role --</option>
        {roles.map((r, idx) => (
          <option key={idx} value={r}>{r}</option>
        ))}
      </select>

      {/* Quiz Block */}
      {questions.length > 0 ? (
        <div className="quiz-block-IQ">
          <p>Q{currentIndex + 1}: {questions[currentIndex].questionText}</p>
          {questions[currentIndex].options.map((opt, idx) => (
            <label key={idx} className="student-option-IQ">
              <input
                type="radio"
                name="option"
                value={opt}
                checked={selectedOption === opt}
                onChange={() => setSelectedOption(opt)}
              />
              {opt}
            </label>
          ))}
          <button onClick={handleNext} className="student-btn-IQ">
            {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
          </button>
        </div>
      ) : role ? (
        <p>No questions available for this role.</p>
      ) : (
        <p>Please select a role to start the quiz.</p>
      )}
    </div>
  );
}

export default StudentInterviewQuiz;
