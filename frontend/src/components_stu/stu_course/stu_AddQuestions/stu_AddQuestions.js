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

  const cancelEdit = () => {
    setEditIndex(-1);
    fetchCourse(); // Reload original questions
  };

  return (
    <div className='all-courses-page'>
      <div className="container-AddQuestions">
        <h2>Manage Quiz Questions for {course?.coursename}</h2>
        
        {error && (
          <div className="alert error-AddQuestions">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert success-AddQuestions">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}
        
        <div className="questions-container">
          {questions.length === 0 ? (
            <div className="no-questions">
              <p>No questions added yet. Click the button below to add your first question.</p>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={idx} className="question-card">
                <div className="question-header">
                  <h3>Question {idx + 1}</h3>
                  {editIndex !== idx && (
                    <div className="question-actions">
                      <button className="edit-btn-AddQuestions" onClick={() => editQuestion(idx)}>
                        Edit
                      </button>
                      <button className="delete-btn-AddQuestions" onClick={() => deleteQuestion(idx)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                {editIndex === idx ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Question Text</label>
                      <textarea
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(e, idx)}
                        name="questionText"
                        rows="3"
                        placeholder="Enter your question here..."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Options</label>
                      {q.options.map((opt, i) => (
                        <div key={i} className="option-input">
                          <span className="option-label">Option {i + 1}</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                            placeholder={`Option ${i + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="form-group">
                      <label>Correct Answer</label>
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(idx, e.target.value)}
                      >
                        <option value="">Select Correct Answer</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt || `Option ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-actions">
                      <button className="save-btn-AddQuestions" onClick={saveQuestions}>
                        Save Question
                      </button>
                      <button className="cancel-btn-AddQuestions" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="question-display">
                    <p className="question-text">{q.questionText || 'No question text'}</p>
                    
                    <div className="options-display">
                      <h4>Options:</h4>
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i} className={opt === q.correctAnswer ? 'correct' : ''}>
                            {opt || `Option ${i + 1} (empty)`}
                            {opt === q.correctAnswer && <span className="correct-badge">Correct</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {questions.length < 10 && editIndex === -1 && (
          <div className="add-question-section">
            <button className="add-question-btn-AddQuestions" onClick={addQuestion}>
              + Add Question
            </button>
            <p className="question-limit">Maximum of 10 questions allowed</p>
          </div>
        )}
        
        {questions.length > 0 && editIndex === -1 && (
          <div className="save-all-section">
            <button className="save-all-btn-AddQuestions" onClick={saveQuestions}>
              Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddQuestions;