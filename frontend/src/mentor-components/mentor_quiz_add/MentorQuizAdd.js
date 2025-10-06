import React, { useState } from 'react';
import { Plus, Trash2, Save, X, FileText } from 'lucide-react';
import './MentorQuizAdd.css';
import Navbar from '../mentor-navbar/MentorNavbar';
import { useNavigate } from "react-router-dom";

const MentorQuizAdd = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    year: new Date().getFullYear(),
    semester: '1',
    duration: 60,
    difficulty: 'Medium',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
        explanation: ''
      }
    ]
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleQuizChange = (field, value) => {
    setQuizData({ ...quizData, [field]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 1,
          explanation: ''
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      setMessage({ type: 'error', text: 'Quiz title is required' });
      return false;
    }
    if (!quizData.subject.trim()) {
      setMessage({ type: 'error', text: 'Subject is required' });
      return false;
    }
    if (quizData.duration < 1) {
      setMessage({ type: 'error', text: 'Duration must be at least 1 minute' });
      return false;
    }
    
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.question.trim()) {
        setMessage({ type: 'error', text: `Question ${i + 1} text is required` });
        return false;
      }
      if (q.options.some(opt => !opt.trim())) {
        setMessage({ type: 'error', text: `All options for question ${i + 1} are required` });
        return false;
      }
      if (!q.correctAnswer.trim()) {
        setMessage({ type: 'error', text: `Correct answer for question ${i + 1} is required` });
        return false;
      }
      if (!q.options.includes(q.correctAnswer)) {
        setMessage({ type: 'error', text: `Correct answer for question ${i + 1} must match one of the options` });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuiz()) {
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Quiz created successfully!' });
        setQuizData({
          title: '',
          subject: '',
          year: new Date().getFullYear(),
          semester: '1',
          duration: 60,
          difficulty: 'Medium',
          questions: [
            {
              question: '',
              options: ['', '', '', ''],
              correctAnswer: '',
              points: 1,
              explanation: ''
            }
          ]
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create quiz' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuizData({
      title: '',
      subject: '',
      year: new Date().getFullYear(),
      semester: '1',
      duration: 60,
      difficulty: 'Medium',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 1,
          explanation: ''
        }
      ]
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div>
      <Navbar />
      <div className="container-mqa">
        <div className="card-mqa">
          <div className="header-mqa">
            <div>
              <h1 className="title-mqa">Create New Quiz</h1>
              <p className="subtitle-mqa">Add practice tests for students</p>
            </div>

            <div className="header-actions-mqa">
              <button
                onClick={() => navigate("/mentor-add-passpaper")}
                className="passpaper-button-mqa"
              >
                <FileText size={20} />
                Add Pass Papers
              </button>
              
              <button
                onClick={resetForm}
                className="reset-button-mqa"
              >
                <X size={20} />
                Reset Form
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`message-mqa ${message.type === 'success' ? 'message-success-mqa' : 'message-error-mqa'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-mqa">
            <div className="quiz-info-mqa">
              <h2 className="section-title-mqa">Quiz Information</h2>
      
              <div className="grid-mqa">
                <div>
                  <label className="label-mqa">Quiz Title *</label>
                  <input
                    type="text"
                    value={quizData.title}
                    onChange={(e) => handleQuizChange('title', e.target.value)}
                    placeholder="e.g., SE3080 - 2023"
                    className="input-mqa"
                    required
                  />
                </div>
                <div>
                  <label className="label-mqa">Subject *</label>
                  <input
                    type="text"
                    value={quizData.subject}
                    onChange={(e) => handleQuizChange('subject', e.target.value)}
                    placeholder="e.g., Software Project Management"
                    className="input-mqa"
                    required
                  />
                </div>
                <div>
                  <label className="label-mqa">Year *</label>
                  <input
                    type="number"
                    value={quizData.year}
                    onChange={(e) => handleQuizChange('year', parseInt(e.target.value))}
                    min="2020"
                    max="2030"
                    className="input-mqa"
                    required
                  />
                </div>
                <div>
                  <label className="label-mqa">Semester *</label>
                  <select
                    value={quizData.semester}
                    onChange={(e) => handleQuizChange('semester', e.target.value)}
                    className="select-mqa"
                    required
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
                <div>
                  <label className="label-mqa">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={quizData.duration}
                    onChange={(e) => handleQuizChange('duration', parseInt(e.target.value))}
                    min="1"
                    className="input-mqa"
                    required
                  />
                </div>
                <div>
                  <label className="label-mqa">Difficulty *</label>
                  <select
                    value={quizData.difficulty}
                    onChange={(e) => handleQuizChange('difficulty', e.target.value)}
                    className="select-mqa"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="questions-mqa">
              <div className="questions-header-mqa">
                <h2 className="section-title-mqa">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="add-button-mqa"
                >
                  <Plus size={20} />
                  Add Question
                </button>
              </div>

              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-card-mqa">
                  <div className="question-header-mqa">
                    <h3 className="question-title-mqa">Question {qIndex + 1}</h3>
                    {quizData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="delete-button-mqa"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="label-mqa">Question Text *</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question here..."
                      rows="3"
                      className="textarea-mqa"
                      required
                    />
                  </div>

                  <div className="options-grid-mqa">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex}>
                        <label className="label-mqa">Option {String.fromCharCode(65 + oIndex)} *</label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Enter option ${String.fromCharCode(65 + oIndex)}`}
                          className="input-mqa"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="answer-points-grid-mqa">
                    <div>
                      <label className="label-mqa">Correct Answer *</label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                        placeholder="Enter the exact correct answer"
                        className="input-mqa"
                        required
                      />
                      <p className="hint-mqa">Must match one of the options exactly</p>
                    </div>
                    <div>
                      <label className="label-mqa">Points</label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                        min="1"
                        className="input-mqa"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-mqa">Explanation (Optional)</label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                      placeholder="Provide an explanation for the correct answer..."
                      rows="2"
                      className="textarea-mqa"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions-mqa">
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button-mqa"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="submit-button-mqa"
              >
                <Save size={20} />
                {loading ? 'Creating Quiz...' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorQuizAdd;