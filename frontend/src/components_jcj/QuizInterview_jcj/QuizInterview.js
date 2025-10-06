import React, { useState } from "react";
import {
  FaCode,
  FaDatabase,
  FaChartLine,
  FaBrain,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaFire,
  FaSnowflake,
  FaMountain,
} from "react-icons/fa";

// Mock Quiz Data
const mockQuizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    role: "Frontend Developer",
    difficulty: "Easy",
    questions: [
      {
        question: "What does === check in JavaScript?",
        options: ["Value only", "Type only", "Value and type", "None"],
        answer: "Value and type",
        explanation:
          "The === operator checks both value and type, making it a strict equality comparison.",
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: "push()",
        explanation:
          "The push() method adds one or more elements to the end of an array.",
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function inside another function",
          "A way to close loops",
          "A type of variable",
          "An error handler",
        ],
        answer: "A function inside another function",
        explanation:
          "A closure is a function that has access to variables in its outer (enclosing) function's scope.",
      },
    ],
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    role: "Frontend Developer",
    difficulty: "Medium",
    questions: [
      {
        question: "What hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useMemo"],
        answer: "useEffect",
        explanation:
          "useEffect is used to perform side effects in functional components like data fetching or subscriptions.",
      },
      {
        question: "When does useEffect run by default?",
        options: [
          "Only on mount",
          "After every render",
          "Before every render",
          "Never",
        ],
        answer: "After every render",
        explanation:
          "Without a dependency array, useEffect runs after every completed render.",
      },
      {
        question: "What does useMemo do?",
        options: [
          "Memoizes a value",
          "Memoizes a function",
          "Creates state",
          "Handles effects",
        ],
        answer: "Memoizes a value",
        explanation:
          "useMemo returns a memoized value, only recomputing when dependencies change.",
      },
      {
        question: "How do you prevent infinite loops in useEffect?",
        options: [
          "Use dependency array",
          "Remove useEffect",
          "Use useState",
          "Use callback",
        ],
        answer: "Use dependency array",
        explanation:
          "Providing a dependency array prevents useEffect from running on every render.",
      },
    ],
  },
  {
    id: "3",
    title: "Advanced CSS Techniques",
    role: "Frontend Developer",
    difficulty: "Hard",
    questions: [
      {
        question: "What is the CSS Grid 'fr' unit?",
        options: [
          "Fixed ratio",
          "Fraction of available space",
          "Frame rate",
          "Full resolution",
        ],
        answer: "Fraction of available space",
        explanation:
          "The 'fr' unit represents a fraction of the available space in the grid container.",
      },
      {
        question: "Which property creates a stacking context?",
        options: [
          "position: static",
          "opacity: 1",
          "transform: rotate(0)",
          "display: block",
        ],
        answer: "transform: rotate(0)",
        explanation:
          "Transform property creates a new stacking context, even with identity transforms.",
      },
      {
        question: "What does 'contain: layout' do?",
        options: [
          "Contains layout changes",
          "Creates container query",
          "Limits width",
          "Centers content",
        ],
        answer: "Contains layout changes",
        explanation:
          "CSS containment property isolates layout changes to improve performance.",
      },
      {
        question: "What is the purpose of 'will-change'?",
        options: [
          "Animate properties",
          "Hint browser for optimization",
          "Change CSS variables",
          "Update DOM",
        ],
        answer: "Hint browser for optimization",
        explanation:
          "will-change hints to the browser which properties will change, allowing for optimization.",
      },
      {
        question: "How does 'clamp()' work?",
        options: [
          "min, preferred, max",
          "start, end, step",
          "low, mid, high",
          "small, medium, large",
        ],
        answer: "min, preferred, max",
        explanation:
          "clamp(min, preferred, max) returns a value between min and max based on the preferred value.",
      },
    ],
  },
  {
    id: "4",
    title: "Database Design Principles",
    role: "Backend Developer",
    difficulty: "Medium",
    questions: [
      {
        question: "What is database normalization?",
        options: [
          "Making data normal",
          "Organizing data to reduce redundancy",
          "Increasing speed",
          "Backing up data",
        ],
        answer: "Organizing data to reduce redundancy",
        explanation:
          "Normalization is the process of organizing data to minimize redundancy and dependency.",
      },
      {
        question: "What is a primary key?",
        options: [
          "Most important field",
          "Unique identifier",
          "First field",
          "Required field",
        ],
        answer: "Unique identifier",
        explanation:
          "A primary key uniquely identifies each record in a database table.",
      },
      {
        question: "What is an index used for?",
        options: [
          "Sorting data",
          "Faster data retrieval",
          "Data validation",
          "Data encryption",
        ],
        answer: "Faster data retrieval",
        explanation:
          "Indexes improve the speed of data retrieval operations on database tables.",
      },
      {
        question: "What does ACID stand for?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Access, Control, Identity, Data",
          "All, Complete, Indexed, Distinct",
          "Arrange, Check, Integrate, Deliver",
        ],
        answer: "Atomicity, Consistency, Isolation, Durability",
        explanation: "ACID properties ensure reliable database transactions.",
      },
    ],
  },
  {
    id: "5",
    title: "SQL Query Optimization",
    role: "Backend Developer",
    difficulty: "Hard",
    questions: [
      {
        question: "What is the best way to optimize a slow query?",
        options: [
          "Add more RAM",
          "Create appropriate indexes",
          "Use faster server",
          "Reduce database size",
        ],
        answer: "Create appropriate indexes",
        explanation:
          "Creating indexes on frequently queried columns significantly improves query performance.",
      },
      {
        question: "What is query execution plan?",
        options: [
          "SQL syntax",
          "Database schema",
          "Steps database takes to execute query",
          "Backup strategy",
        ],
        answer: "Steps database takes to execute query",
        explanation:
          "An execution plan shows how the database engine will execute a query.",
      },
      {
        question: "When should you use EXPLAIN?",
        options: [
          "To add comments",
          "To analyze query performance",
          "To create tables",
          "To delete data",
        ],
        answer: "To analyze query performance",
        explanation:
          "EXPLAIN shows the execution plan, helping identify performance bottlenecks.",
      },
      {
        question: "What is the N+1 query problem?",
        options: [
          "Math error",
          "Multiple queries in loop",
          "Syntax error",
          "Connection issue",
        ],
        answer: "Multiple queries in loop",
        explanation:
          "N+1 problem occurs when you execute N additional queries for each result of an initial query.",
      },
      {
        question: "What does 'covering index' mean?",
        options: [
          "Index on all columns",
          "Index contains all needed data",
          "Largest index",
          "Primary index",
        ],
        answer: "Index contains all needed data",
        explanation:
          "A covering index includes all columns needed for a query, avoiding table lookups.",
      },
    ],
  },
  {
    id: "6",
    title: "Python for Data Science",
    role: "Data Science",
    difficulty: "Easy",
    questions: [
      {
        question: "Which library is used for data manipulation?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        answer: "Pandas",
        explanation:
          "Pandas is the primary library for data manipulation and analysis in Python.",
      },
      {
        question: "What does DataFrame represent?",
        options: [
          "A graph",
          "2D labeled data structure",
          "Neural network",
          "File system",
        ],
        answer: "2D labeled data structure",
        explanation:
          "A DataFrame is a 2-dimensional labeled data structure with columns of potentially different types.",
      },
      {
        question: "Which method reads CSV files?",
        options: ["read_csv()", "open_csv()", "load_csv()", "import_csv()"],
        answer: "read_csv()",
        explanation:
          "pandas.read_csv() is used to read comma-separated values files into DataFrame.",
      },
    ],
  },
  {
    id: "7",
    title: "Machine Learning Basics",
    role: "Data Science",
    difficulty: "Medium",
    questions: [
      {
        question: "What is supervised learning?",
        options: [
          "Learning with teacher",
          "Learning with labeled data",
          "Unsupervised method",
          "Random learning",
        ],
        answer: "Learning with labeled data",
        explanation:
          "Supervised learning uses labeled training data to learn the mapping between inputs and outputs.",
      },
      {
        question: "What is overfitting?",
        options: [
          "Model too simple",
          "Model too complex for data",
          "Perfect model",
          "Fast training",
        ],
        answer: "Model too complex for data",
        explanation:
          "Overfitting occurs when a model learns the training data too well, including noise and outliers.",
      },
      {
        question: "What is train-test split used for?",
        options: [
          "Speed up training",
          "Evaluate model performance",
          "Clean data",
          "Feature engineering",
        ],
        answer: "Evaluate model performance",
        explanation:
          "Train-test split separates data to train the model and evaluate its performance on unseen data.",
      },
      {
        question: "What is cross-validation?",
        options: [
          "Validating inputs",
          "Multiple train-test splits",
          "Checking accuracy once",
          "Data cleaning",
        ],
        answer: "Multiple train-test splits",
        explanation:
          "Cross-validation uses multiple train-test splits to get a better estimate of model performance.",
      },
    ],
  },
  {
    id: "8",
    title: "REST API Design",
    role: "Backend Developer",
    difficulty: "Easy",
    questions: [
      {
        question: "What does REST stand for?",
        options: [
          "Representational State Transfer",
          "Remote State Transfer",
          "Real Estate Transfer",
          "Rapid Service Technology",
        ],
        answer: "Representational State Transfer",
        explanation:
          "REST is an architectural style for designing networked applications.",
      },
      {
        question: "Which HTTP method retrieves data?",
        options: ["POST", "GET", "PUT", "DELETE"],
        answer: "GET",
        explanation: "GET method is used to retrieve data from a server.",
      },
      {
        question: "What status code means 'Created'?",
        options: ["200", "201", "204", "404"],
        answer: "201",
        explanation:
          "201 status code indicates that a request has succeeded and a new resource has been created.",
      },
    ],
  },
];

// Mock Progress Data
const mockProgress = [
  {
    quizId: "1",
    title: "JavaScript Fundamentals",
    score: 100,
    totalQuestions: 3,
    date: "2025-09-28",
    difficulty: "Easy",
    role: "Frontend Developer",
  },
  {
    quizId: "2",
    title: "React Hooks Deep Dive",
    score: 75,
    totalQuestions: 4,
    date: "2025-09-27",
    difficulty: "Medium",
    role: "Frontend Developer",
  },
  {
    quizId: "4",
    title: "Database Design Principles",
    score: 50,
    totalQuestions: 4,
    date: "2025-09-25",
    difficulty: "Medium",
    role: "Backend Developer",
  },
  {
    quizId: "6",
    title: "Python for Data Science",
    score: 67,
    totalQuestions: 3,
    date: "2025-09-24",
    difficulty: "Easy",
    role: "Data Science",
  },
];

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userProgress, setUserProgress] = useState(mockProgress);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView("quiz");
  };

  const finishQuiz = (quizData) => {
    const newProgress = {
      quizId: quizData.id,
      title: quizData.title,
      score: quizData.score,
      totalQuestions: quizData.totalQuestions,
      date: new Date().toISOString().split("T")[0],
      difficulty: quizData.difficulty,
      role: quizData.role,
    };
    setUserProgress([newProgress, ...userProgress]);
    setCurrentView("list");
  };

  return (
    <div className="jcj-quiz-app">
      <header className="jcj-quiz-header">
        <div className="jcj-quiz-header-content">
          <h1 className="jcj-quiz-logo">
            <FaBrain className="jcj-quiz-logo-icon" />
            InterviewPrep Quiz
          </h1>
          <nav className="jcj-quiz-nav">
            <button
              className={`jcj-quiz-nav-btn ${
                currentView === "list" ? "jcj-quiz-nav-btn-active" : ""
              }`}
              onClick={() => setCurrentView("list")}
            >
              <FaCode /> Quizzes
            </button>
            <button
              className={`jcj-quiz-nav-btn ${
                currentView === "progress" ? "jcj-quiz-nav-btn-active" : ""
              }`}
              onClick={() => setCurrentView("progress")}
            >
              <FaChartLine /> Progress
            </button>
          </nav>
        </div>
      </header>

      <main className="jcj-quiz-main">
        {currentView === "list" && (
          <QuizList quizzes={mockQuizzes} onStartQuiz={startQuiz} />
        )}
        {currentView === "quiz" && (
          <QuizPage
            quiz={selectedQuiz}
            onFinish={finishQuiz}
            onBack={() => setCurrentView("list")}
          />
        )}
        {currentView === "progress" && <Progress progressData={userProgress} />}
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .jcj-quiz-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .jcj-quiz-header {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .jcj-quiz-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .jcj-quiz-logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: #667eea;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jcj-quiz-logo-icon {
          font-size: 2rem;
        }

        .jcj-quiz-nav {
          display: flex;
          gap: 1rem;
        }

        .jcj-quiz-nav-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid transparent;
          background: white;
          color: #4a5568;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jcj-quiz-nav-btn:hover {
          background: #f7fafc;
          transform: translateY(-2px);
        }

        .jcj-quiz-nav-btn-active {
          background: #667eea;
          color: white;
        }

        .jcj-quiz-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .jcj-quiz-list-container {
          animation: jcjQuizFadeIn 0.5s ease;
        }

        @keyframes jcjQuizFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .jcj-quiz-filters {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .jcj-quiz-filter-group {
          margin-bottom: 1rem;
        }

        .jcj-quiz-filter-group:last-child {
          margin-bottom: 0;
        }

        .jcj-quiz-filter-label {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .jcj-quiz-filter-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .jcj-quiz-filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          background: white;
          color: #4a5568;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jcj-quiz-filter-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .jcj-quiz-filter-btn-active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .jcj-quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .jcj-quiz-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .jcj-quiz-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }

        .jcj-quiz-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .jcj-quiz-difficulty {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .jcj-quiz-difficulty-easy {
          background: #c6f6d5;
          color: #22543d;
        }

        .jcj-quiz-difficulty-medium {
          background: #fef3c7;
          color: #78350f;
        }

        .jcj-quiz-difficulty-hard {
          background: #fecaca;
          color: #7f1d1d;
        }

        .jcj-quiz-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .jcj-quiz-card-role {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .jcj-quiz-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .jcj-quiz-question-count {
          color: #718096;
          font-size: 0.9rem;
        }

        .jcj-quiz-start-btn {
          padding: 0.6rem 1.2rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jcj-quiz-start-btn:hover {
          background: #5568d3;
          transform: scale(1.05);
        }

        .jcj-quiz-page {
          animation: jcjQuizFadeIn 0.5s ease;
        }

        .jcj-quiz-page-header {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .jcj-quiz-page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .jcj-quiz-page-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .jcj-quiz-progress-bar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .jcj-quiz-progress-text {
          font-size: 0.9rem;
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .jcj-quiz-progress-track {
          background: #e2e8f0;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }

        .jcj-quiz-progress-fill {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          height: 100%;
          transition: width 0.3s ease;
        }

        .jcj-quiz-question-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .jcj-quiz-question-number {
          color: #667eea;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .jcj-quiz-question-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .jcj-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .jcj-quiz-option {
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          text-align: left;
        }

        .jcj-quiz-option:hover {
          border-color: #667eea;
          background: #f7fafc;
        }

        .jcj-quiz-option-selected {
          border-color: #667eea;
          background: #eef2ff;
          font-weight: 600;
        }

        .jcj-quiz-option-correct {
          border-color: #48bb78;
          background: #c6f6d5;
        }

        .jcj-quiz-option-incorrect {
          border-color: #f56565;
          background: #fed7d7;
        }

        .jcj-quiz-option-disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .jcj-quiz-explanation {
          margin-top: 1rem;
          padding: 1rem;
          background: #eef2ff;
          border-left: 4px solid #667eea;
          border-radius: 4px;
          animation: jcjQuizSlideDown 0.3s ease;
        }

        @keyframes jcjQuizSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .jcj-quiz-explanation-text {
          color: #4a5568;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .jcj-quiz-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .jcj-quiz-btn {
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jcj-quiz-btn-primary {
          background: #667eea;
          color: white;
        }

        .jcj-quiz-btn-primary:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .jcj-quiz-btn-secondary {
          background: white;
          color: #4a5568;
          border: 2px solid #e2e8f0;
        }

        .jcj-quiz-btn-secondary:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .jcj-quiz-btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .jcj-quiz-results {
          background: white;
          padding: 3rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: jcjQuizFadeIn 0.5s ease;
        }

        .jcj-quiz-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .jcj-quiz-results-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .jcj-quiz-results-score {
          font-size: 3rem;
          font-weight: 700;
          color: #667eea;
          margin: 1rem 0;
        }

        .jcj-quiz-results-message {
          font-size: 1.1rem;
          color: #718096;
          margin-bottom: 2rem;
        }

        .jcj-quiz-results-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .jcj-quiz-results-stat {
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .jcj-quiz-results-stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
        }

        .jcj-quiz-results-stat-label {
          font-size: 0.9rem;
          color: #718096;
          margin-top: 0.25rem;
        }

        .jcj-quiz-progress-container {
          animation: jcjQuizFadeIn 0.5s ease;
        }

        .jcj-quiz-progress-header {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .jcj-quiz-progress-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .jcj-quiz-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .jcj-quiz-stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          border-radius: 12px;
          color: white;
        }

        .jcj-quiz-stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .jcj-quiz-stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .jcj-quiz-history {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .jcj-quiz-history-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .jcj-quiz-history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .jcj-quiz-history-item {
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .jcj-quiz-history-item:hover {
          border-color: #667eea;
          background: #f7fafc;
        }

        .jcj-quiz-history-item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .jcj-quiz-history-item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
        }

        .jcj-quiz-history-item-score {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .jcj-quiz-history-item-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.85rem;
          color: #718096;
        }

        .jcj-quiz-history-item-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .jcj-quiz-no-data {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }

        .jcj-quiz-no-data-icon {
          font-size: 4rem;
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .jcj-quiz-no-data-text {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .jcj-quiz-header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .jcj-quiz-nav {
            width: 100%;
          }

          .jcj-quiz-nav-btn {
            flex: 1;
          }

          .jcj-quiz-grid {
            grid-template-columns: 1fr;
          }

          .jcj-quiz-main {
            padding: 1rem;
          }

          .jcj-quiz-page-title {
            font-size: 1.5rem;
          }

          .jcj-quiz-results-score {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

// Quiz List Component
const QuizList = ({ quizzes, onStartQuiz }) => {
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const roles = ["All", ...new Set(quizzes.map((q) => q.role))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesDifficulty =
      difficultyFilter === "All" || quiz.difficulty === difficultyFilter;
    const matchesRole = roleFilter === "All" || quiz.role === roleFilter;
    return matchesDifficulty && matchesRole;
  });

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return <FaSnowflake />;
      case "Medium":
        return <FaFire />;
      case "Hard":
        return <FaMountain />;
      default:
        return null;
    }
  };

  const getRoleIcon = (role) => {
    if (role.includes("Frontend")) return <FaCode />;
    if (role.includes("Backend")) return <FaDatabase />;
    if (role.includes("Data")) return <FaChartLine />;
    return <FaCode />;
  };

  return (
    <div className="jcj-quiz-list-container">
      <div className="jcj-quiz-filters">
        <div className="jcj-quiz-filter-group">
          <label className="jcj-quiz-filter-label">Difficulty</label>
          <div className="jcj-quiz-filter-btns">
            {difficulties.map((diff) => (
              <button
                key={diff}
                className={`jcj-quiz-filter-btn ${
                  difficultyFilter === diff ? "jcj-quiz-filter-btn-active" : ""
                }`}
                onClick={() => setDifficultyFilter(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
        <div className="jcj-quiz-filter-group">
          <label className="jcj-quiz-filter-label">Role</label>
          <div className="jcj-quiz-filter-btns">
            {roles.map((role) => (
              <button
                key={role}
                className={`jcj-quiz-filter-btn ${
                  roleFilter === role ? "jcj-quiz-filter-btn-active" : ""
                }`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="jcj-quiz-grid">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="jcj-quiz-card">
            <div className="jcj-quiz-card-header">
              <div
                className={`jcj-quiz-difficulty jcj-quiz-difficulty-${quiz.difficulty.toLowerCase()}`}
              >
                {getDifficultyIcon(quiz.difficulty)}
                {quiz.difficulty}
              </div>
            </div>
            <h3 className="jcj-quiz-card-title">{quiz.title}</h3>
            <div className="jcj-quiz-card-role">
              {getRoleIcon(quiz.role)}
              {quiz.role}
            </div>
            <div className="jcj-quiz-card-meta">
              <span className="jcj-quiz-question-count">
                {quiz.questions.length} Questions
              </span>
              <button
                className="jcj-quiz-start-btn"
                onClick={() => onStartQuiz(quiz)}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="jcj-quiz-no-data">
          <div className="jcj-quiz-no-data-icon">🔍</div>
          <p className="jcj-quiz-no-data-text">
            No quizzes found with the selected filters.
          </p>
        </div>
      )}
    </div>
  );
};

// Quiz Page Component
const QuizPage = ({ quiz, onFinish, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState({});

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (option) => {
    if (showExplanations[currentQuestionIndex]) return;

    setAnswers({
      ...answers,
      [currentQuestionIndex]: option,
    });
  };

  const handleCheckAnswer = () => {
    setShowExplanations({
      ...showExplanations,
      [currentQuestionIndex]: true,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = quiz.questions.filter(
      (q, idx) => answers[idx] === q.answer
    ).length;

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    setShowResults(true);
  };

  const handleFinish = () => {
    const correctAnswers = quiz.questions.filter(
      (q, idx) => answers[idx] === q.answer
    ).length;

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    onFinish({
      id: quiz.id,
      title: quiz.title,
      score,
      totalQuestions: quiz.questions.length,
      difficulty: quiz.difficulty,
      role: quiz.role,
    });
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! You're an expert! 🎉";
    if (score >= 70) return "Great job! You're doing well! 👏";
    if (score >= 50) return "Good effort! Keep practicing! 💪";
    return "Keep learning! You'll improve! 📚";
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <FaTrophy style={{ color: "#fbbf24" }} />;
    if (score >= 70) return <FaCheckCircle style={{ color: "#48bb78" }} />;
    return <FaCheckCircle style={{ color: "#667eea" }} />;
  };

  if (showResults) {
    const correctAnswers = quiz.questions.filter(
      (q, idx) => answers[idx] === q.answer
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <div className="jcj-quiz-results">
        <div className="jcj-quiz-results-icon">{getScoreIcon(score)}</div>
        <h2 className="jcj-quiz-results-title">Quiz Complete!</h2>
        <div className="jcj-quiz-results-score">{score}%</div>
        <p className="jcj-quiz-results-message">{getScoreMessage(score)}</p>

        <div className="jcj-quiz-results-details">
          <div className="jcj-quiz-results-stat">
            <div className="jcj-quiz-results-stat-value">{correctAnswers}</div>
            <div className="jcj-quiz-results-stat-label">Correct</div>
          </div>
          <div className="jcj-quiz-results-stat">
            <div className="jcj-quiz-results-stat-value">
              {quiz.questions.length - correctAnswers}
            </div>
            <div className="jcj-quiz-results-stat-label">Incorrect</div>
          </div>
          <div className="jcj-quiz-results-stat">
            <div className="jcj-quiz-results-stat-value">
              {quiz.questions.length}
            </div>
            <div className="jcj-quiz-results-stat-label">Total</div>
          </div>
        </div>

        <div className="jcj-quiz-actions">
          <button
            className="jcj-quiz-btn jcj-quiz-btn-secondary"
            onClick={onBack}
          >
            Back to Quizzes
          </button>
          <button
            className="jcj-quiz-btn jcj-quiz-btn-primary"
            onClick={handleFinish}
          >
            Save & Continue
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = Object.keys(answers).length === quiz.questions.length;
  const currentAnswered = answers[currentQuestionIndex] !== undefined;
  const isCorrect = answers[currentQuestionIndex] === currentQuestion.answer;

  return (
    <div className="jcj-quiz-page">
      <div className="jcj-quiz-page-header">
        <h2 className="jcj-quiz-page-title">{quiz.title}</h2>
        <div className="jcj-quiz-page-meta">
          <span
            className={`jcj-quiz-difficulty jcj-quiz-difficulty-${quiz.difficulty.toLowerCase()}`}
          >
            {quiz.difficulty}
          </span>
          <span className="jcj-quiz-card-role">{quiz.role}</span>
        </div>
      </div>

      <div className="jcj-quiz-progress-bar">
        <div className="jcj-quiz-progress-text">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div className="jcj-quiz-progress-track">
          <div
            className="jcj-quiz-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="jcj-quiz-question-card">
        <div className="jcj-quiz-question-number">
          Question {currentQuestionIndex + 1}
        </div>
        <h3 className="jcj-quiz-question-text">{currentQuestion.question}</h3>

        <div className="jcj-quiz-options">
          {currentQuestion.options.map((option, idx) => {
            let optionClass = "jcj-quiz-option";

            if (answers[currentQuestionIndex] === option) {
              optionClass += " jcj-quiz-option-selected";
            }

            if (showExplanations[currentQuestionIndex]) {
              optionClass += " jcj-quiz-option-disabled";
              if (option === currentQuestion.answer) {
                optionClass += " jcj-quiz-option-correct";
              } else if (
                answers[currentQuestionIndex] === option &&
                option !== currentQuestion.answer
              ) {
                optionClass += " jcj-quiz-option-incorrect";
              }
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            );
          })}
        </div>

        {currentAnswered && !showExplanations[currentQuestionIndex] && (
          <div className="jcj-quiz-actions">
            <button
              className="jcj-quiz-btn jcj-quiz-btn-primary"
              onClick={handleCheckAnswer}
            >
              Check Answer
            </button>
          </div>
        )}

        {showExplanations[currentQuestionIndex] && (
          <div className="jcj-quiz-explanation">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              {isCorrect ? (
                <>
                  <FaCheckCircle style={{ color: "#48bb78" }} />
                  <span style={{ color: "#22543d" }}>Correct!</span>
                </>
              ) : (
                <>
                  <FaTimesCircle style={{ color: "#f56565" }} />
                  <span style={{ color: "#7f1d1d" }}>Incorrect</span>
                </>
              )}
            </div>
            <p className="jcj-quiz-explanation-text">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="jcj-quiz-actions">
        <button
          className="jcj-quiz-btn jcj-quiz-btn-secondary"
          onClick={onBack}
        >
          Exit Quiz
        </button>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className={`jcj-quiz-btn jcj-quiz-btn-secondary ${
              currentQuestionIndex === 0 ? "jcj-quiz-btn-disabled" : ""
            }`}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              className="jcj-quiz-btn jcj-quiz-btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className={`jcj-quiz-btn jcj-quiz-btn-primary ${
                !allAnswered ? "jcj-quiz-btn-disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Progress Component
const Progress = ({ progressData }) => {
  if (progressData.length === 0) {
    return (
      <div className="jcj-quiz-progress-container">
        <div className="jcj-quiz-no-data">
          <div className="jcj-quiz-no-data-icon">📊</div>
          <p className="jcj-quiz-no-data-text">
            No quiz attempts yet. Start taking quizzes to see your progress!
          </p>
        </div>
      </div>
    );
  }

  const totalQuizzes = progressData.length;
  const averageScore = Math.round(
    progressData.reduce((sum, p) => sum + p.score, 0) / totalQuizzes
  );
  const highestScore = Math.max(...progressData.map((p) => p.score));
  const totalQuestions = progressData.reduce(
    (sum, p) => sum + p.totalQuestions,
    0
  );

  return (
    <div className="jcj-quiz-progress-container">
      <div className="jcj-quiz-progress-header">
        <h2 className="jcj-quiz-progress-title">Your Progress</h2>

        <div className="jcj-quiz-stats-grid">
          <div className="jcj-quiz-stat-card">
            <div className="jcj-quiz-stat-value">{totalQuizzes}</div>
            <div className="jcj-quiz-stat-label">Quizzes Taken</div>
          </div>
          <div className="jcj-quiz-stat-card">
            <div className="jcj-quiz-stat-value">{averageScore}%</div>
            <div className="jcj-quiz-stat-label">Average Score</div>
          </div>
          <div className="jcj-quiz-stat-card">
            <div className="jcj-quiz-stat-value">{highestScore}%</div>
            <div className="jcj-quiz-stat-label">Highest Score</div>
          </div>
          <div className="jcj-quiz-stat-card">
            <div className="jcj-quiz-stat-value">{totalQuestions}</div>
            <div className="jcj-quiz-stat-label">Questions Answered</div>
          </div>
        </div>
      </div>

      <div className="jcj-quiz-history">
        <h3 className="jcj-quiz-history-title">Recent Attempts</h3>
        <div className="jcj-quiz-history-list">
          {progressData.map((attempt, idx) => (
            <div key={idx} className="jcj-quiz-history-item">
              <div className="jcj-quiz-history-item-header">
                <div>
                  <div className="jcj-quiz-history-item-title">
                    {attempt.title}
                  </div>
                  <div className="jcj-quiz-history-item-meta">
                    <span>{attempt.role}</span>
                    <span>{attempt.difficulty}</span>
                    <span>{attempt.date}</span>
                    <span>{attempt.totalQuestions} questions</span>
                  </div>
                </div>
                <div className="jcj-quiz-history-item-score">
                  {attempt.score}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
