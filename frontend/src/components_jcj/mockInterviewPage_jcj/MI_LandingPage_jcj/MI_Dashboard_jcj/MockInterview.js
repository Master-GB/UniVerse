import React, { useState, useEffect, useRef } from "react";
import "./mockInterview_jcj.css";
import DarkVeil from "../DarkVeil/DarkVeil";

const MockInterview = () => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Mock questions for demo
  const mockQuestions = [
    "Tell me about yourself and your background in software development.",
    "What interests you most about this position and our company?",
    "Describe a challenging project you've worked on recently. How did you overcome the obstacles?",
    "How do you stay updated with the latest technology trends?",
    "Where do you see yourself in 5 years in your career?",
  ];

  const startInterview = () => {
    setInterviewStarted(true);
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const firstQuestion = mockQuestions[0];
      setCurrentQuestion(firstQuestion);

      // this will initialize chat history with the first question from the mockQuestions array
      setChatHistory([
        { type: "ai", message: firstQuestion, timestamp: new Date() }, // AI's first question, as an object
      ]);

      setIsTyping(false);
    }, 2000);
  };

  const submitAnswer = async () => {
    // Do nothing if answer is empty
    if (!userAnswer.trim()) return;
    setIsLoading(true);

    // Add user answer
    const updatedHistory = [
      ...chatHistory,
      { type: "user", message: userAnswer, timestamp: new Date() },
    ];
    setChatHistory(updatedHistory);

    try {
      const res = await fetch("http://localhost:8070/api/interview/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer, chatHistory: updatedHistory }),
      });

      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        { type: "ai", message: data.reply, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
    setUserAnswer("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  return (
    <div className="interview-container-jcj">
      {/* Add DarkVeil as background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <DarkVeil
          hueShift={20}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          speed={1.3}
          scanlineFrequency={0.5}
          warpAmount={0.2}
          resolutionScale={1}
        />
      </div>

      <div className="interview-header-jcj">
        <div className="header-content-jcj">
          <div className="ai-badge-jcj">
            <div className="ai-icon-jcj">🤖</div>
            <span>Powered by Gemini AI</span>
          </div>
          <h1 className="interview-title-jcj">Mock Interview Platform</h1>
          <div className="progress-indicator-jcj">
            Question {questionCount} of {mockQuestions.length}
          </div>
        </div>
      </div>

      {!interviewStarted ? (
        <div className="welcome-screen-jcj">
          <div className="welcome-content-jcj">
            <div className="gemini-logo-jcj">✨</div>
            <h2 className="welcome-title-jcj-MI">
              Welcome to AI Mock Interview
            </h2>
            <p className="welcome-description-jcj">
              Get ready for your next interview with our AI-powered mock
              interview platform. Our advanced Gemini AI will ask you relevant
              questions and provide valuable feedback to help you improve your
              interview skills.
            </p>
            <div className="features-list-jcj">
              <div className="feature-item-jcj">
                <span className="feature-icon-jcj">🎯</span>
                <span>Personalized Questions</span>
              </div>
              <div className="feature-item-jcj">
                <span className="feature-icon-jcj">📊</span>
                <span>Real-time Evaluation</span>
              </div>
              <div className="feature-item-jcj">
                <span className="feature-icon-jcj">💡</span>
                <span>Instant Feedback</span>
              </div>
            </div>
            <button className="start-button-jcj" onClick={startInterview}>
              Start Mock Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="interview-active-jcj">
          <div className="chat-container-jcj" ref={chatContainerRef}>
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={`message-bubble-jcj ${
                  item.type === "ai" ? "ai-message-jcj" : "user-message-jcj"
                }`}
              >
                <div className="message-content-jcj">
                  <div className="message-text-jcj">{item.message}</div>
                  <div className="message-time-jcj">
                    {item.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble-jcj ai-message-jcj">
                <div className="typing-indicator-jcj">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="input-section-jcj">
            <div className="input-container-jcj">
              <textarea
                className="answer-input-jcj"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here... (Press Enter to submit, Shift+Enter for new line)"
                disabled={isLoading || isTyping}
                rows="3"
              />
              <button
                className={`submit-button-jcj ${
                  isLoading ? "loading-jcj" : ""
                }`}
                onClick={submitAnswer}
                disabled={!userAnswer.trim() || isLoading || isTyping}
              >
                {isLoading ? (
                  <div className="loading-spinner-jcj"></div>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
