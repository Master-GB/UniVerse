import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./stu_AddQuestions.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

function AddQuestions() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/getid/${id}`);
      setCourse(res.data);
      setQuestions(res.data.questions && res.data.questions.length > 0 ? res.data.questions : []);
      setError('');
    } catch (err) {
      setError('Failed to load course details: ' + (err.response?.data?.message || err.message));
    }
  };

  // For question text
  const handleQuestionChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...questions];
    updated[index][name] = value;
    setQuestions(updated);
  };

  // For option updates
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // For selecting correct answer
  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  // Old handleChange kept for backward safety
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = { ...updatedQuestions[editIndex], [name]: value };
      setQuestions(updatedQuestions);
    } else if (questions.length === 0) {
      setQuestions([{ questionText: '', options: ["", "", "", ""], correctAnswer: '', [name]: value }]);
    } else {
      const updatedQuestions = [...questions];
      updatedQuestions[0] = { ...updatedQuestions[0], [name]: value };
      setQuestions(updatedQuestions);
    }
  };

  const addQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, { questionText: '', options: ["", "", "", ""], correctAnswer: '' }]);
      setEditIndex(questions.length);
    } else {
      setError('Cannot add more than 10 questions');
    }
  };

  const saveQuestions = async () => {
    for (let q of questions) {
      if (!q.questionText || q.options.some(opt => !opt) || !q.correctAnswer) {
        setError('All questions, options, and correct answer are required');
        return;
      }
    }
    try {
      await axios.put(`${API_URL}/api/courses/update/${id}`, { questions });
      setSuccess('Questions saved successfully');
      setError('');
      setEditIndex(-1);
      await fetchCourse();
    } catch (err) {
      setError('Failed to save questions: ' + (err.response?.data?.message || err.message));
    }
  };

  const editQuestion = (index) => {
    setEditIndex(index);
  };

  const deleteQuestion = async (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    try {
      await axios.put(`${API_URL}/api/courses/update/${id}`, { questions: updatedQuestions });
      setQuestions(updatedQuestions);
      setSuccess('Question deleted successfully');
      setError('');
      setEditIndex(-1);
      await fetchCourse();
    } catch (err) {
      setError('Failed to delete question: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className='all-courses-page'>
      <div className="container-AddQuestions">
        <h2>Manage Quiz Questions for Course {course?.coursename}</h2>
        {error && <p className="error-AddQuestions">{error}</p>}
        {success && <p className="success-AddQuestions">{success}</p>}
        <table className="question-table-AddQuestions">
          <thead>
            <tr>
              <th>Question</th>
              <th>Options & Correct Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={idx}>
                <td>
                  {editIndex === idx ? (
                    <input
                      type="text"
                      name="questionText"
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(e, idx)}
                    />
                  ) : (
                    q.questionText || 'No question text'
                  )}
                </td>
                <td>
                  {editIndex === idx ? (
                    <div>
                      {q.options.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                        />
                      ))}
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(idx, e.target.value)}
                      >
                        <option value="">Select Correct Answer</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt || `Option ${i + 1}`}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <strong>Options:</strong> {q.options?.join(", ")} <br />
                      <strong>Correct:</strong> {q.correctAnswer}
                    </div>
                  )}
                </td>
                <td>
                  {editIndex === idx ? (
                    <button className="save-btn-AddQuestions" onClick={saveQuestions}>Save</button>
                  ) : (
                    <>
                      <button className="edit-btn-AddQuestions" onClick={() => editQuestion(idx)}>Edit</button>
                      <button className="delete-btn-AddQuestions" onClick={() => deleteQuestion(idx)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length < 10 && (
          <button className="add-question-btn-AddQuestions" onClick={addQuestion}>
            Add Another Question
          </button>
        )}
      </div>
    </div>
  );
}

export default AddQuestions;
