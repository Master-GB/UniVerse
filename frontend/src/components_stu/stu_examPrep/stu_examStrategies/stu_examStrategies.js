import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './stu_examStrategies.css';

const ExamStrategies = ({ history }) => {
  const [activeTab, setActiveTab] = useState('before');
  
  const handleBack = () => {
    window.history.back();
  };

  const strategies = {
    before: [
      {
        id: 1,
        title: "Create a Study Plan",
        description: "Develop a realistic study schedule that covers all topics with sufficient time for revision.",
        icon: "📅",
        tips: [
          "Break down subjects into manageable chunks",
          "Allocate more time to challenging topics",
          "Include regular review sessions",
          "Set specific goals for each study session"
        ]
      },
      {
        id: 2,
        title: "Gather Study Materials",
        description: "Organize all necessary resources before you begin studying.",
        icon: "📚",
        tips: [
          "Collect textbooks, notes, and past papers",
          "Use online resources and educational apps",
          "Create summary sheets for quick revision",
          "Organize digital files and bookmarks"
        ]
      },
      {
        id: 3,
        title: "Set Up Study Environment",
        description: "Create a distraction-free study space that promotes focus.",
        icon: "🖥️",
        tips: [
          "Find a quiet, well-lit area",
          "Keep your study materials organized",
          "Minimize digital distractions",
          "Ensure comfortable seating and proper ergonomics"
        ]
      },
      {
        id: 4,
        title: "Practice Past Papers",
        description: "Familiarize yourself with exam patterns and question styles by solving previous years' papers.",
        icon: "📋",
        tips: [
          "Start with older papers and work your way to recent ones",
          "Time yourself to simulate exam conditions",
          "Analyze your mistakes and learn from them",
          "Note recurring topics and question patterns"
        ]
      },
      {
        id: 5,
        title: "Join Study Groups",
        description: "Collaborate with peers to enhance understanding through discussion and shared knowledge.",
        icon: "👥",
        tips: [
          "Find dedicated study partners or groups",
          "Set specific goals for each group session",
          "Teach concepts to others to reinforce your own learning",
          "Share resources and study materials"
        ]
      },
      {
        id: 6,
        title: "Create Mind Maps",
        description: "Visualize complex information to improve memory retention and understanding.",
        icon: "📝",
        tips: [
          "Use colors and images to make connections",
          "Start with main topics and branch out",
          "Keep them simple and easy to review",
          "Update them as you learn more"
        ]
      },
      {
        id: 7,
        title: "Teach What You Learn",
        description: "Reinforce your understanding by explaining concepts to others.",
        icon: "👨‍🏫",
        tips: [
          "Explain topics to a study partner",
          "Create simple explanations for complex ideas",
          "Record yourself teaching key concepts",
          "Join or form a study group"
        ]
      },
      {
        id: 8,
        title: "Use Mnemonics",
        description: "Create memory aids to help remember complex information.",
        icon: "🧠",
        tips: [
          "Create acronyms for lists",
          "Use visualization techniques",
          "Make up stories or rhymes",
          "Connect new info to existing knowledge"
        ]
      },
      {
        id: 9,
        title: "Active Recall Practice",
        description: "Test yourself regularly to strengthen memory retention.",
        icon: "🔁",
        tips: [
          "Use flashcards for key concepts",
          "Practice without looking at notes",
          "Test yourself on past papers",
          "Create your own practice questions"
        ]
      }
    ],
    during: [
      {
        id: 1,
        title: "Read Instructions Carefully",
        description: "Take time to understand what each question is asking before answering.",
        icon: "📖",
        tips: [
          "Underline key words in questions",
          "Note the marks allocated to each question",
          "Plan your time based on question weight",
          "Read all options before selecting an answer"
        ]
      },
      {
        id: 2,
        title: "Manage Your Time",
        description: "Allocate appropriate time to each section based on marks.",
        icon: "⏳",
        tips: [
          "Start with questions you know well",
          "Keep an eye on the clock",
          "Leave time for reviewing answers",
          "Avoid spending too much time on a single question"
        ]
      },
      {
        id: 3,
        title: "Answer Strategically",
        description: "Maximize your score by approaching questions in the most effective way.",
        icon: "🎯",
        tips: [
          "Answer what you know first, then return to harder questions",
          "Look for clues in the wording of questions",
          "Use the process of elimination for multiple choice",
          "Show your work for partial credit"
        ]
      },
      {
        id: 4,
        title: "Stay Calm and Focused",
        description: "Maintain composure to perform at your best during the exam.",
        icon: "🧘",
        tips: [
          "Take deep breaths if you feel anxious",
          "Focus on one question at a time",
          "Don't worry about other students' progress",
          "Use positive self-talk"
        ]
      },
      {
        id: 5,
        title: "Check Your Work",
        description: "Use remaining time to review and verify your answers.",
        icon: "🔍",
        tips: [
          "Look for careless mistakes first",
          "Verify calculations and units",
          "Check that you've answered all parts of each question",
          "Ensure your answers make sense in context"
        ]
      },
      {
        id: 6,
        title: "Manage Your Energy",
        description: "Maintain focus and concentration throughout the exam duration.",
        icon: "⚡",
        tips: [
          "Take short mental breaks if allowed",
          "Stay hydrated and have a small snack if possible",
          "Adjust your posture to stay alert",
          "Use all the time you're given"
        ]
      },
      {
        id: 7,
        title: "Process of Elimination",
        description: "Narrow down multiple-choice options to improve your chances.",
        icon: "❌",
        tips: [
          "Eliminate obviously wrong answers first",
          "Look for similar answer choices",
          "Beware of 'all of the above' options",
          "Trust your first instinct"
        ]
      },
      {
        id: 8,
        title: "Show Your Work",
        description: "Document your thought process for partial credit.",
        icon: "📝",
        tips: [
          "Write down formulas and steps",
          "Label your work clearly",
          "Show calculations even if you're not sure",
          "Cross out incorrect work instead of erasing"
        ]
      },
      {
        id: 9,
        title: "Time Management",
        description: "Allocate your time wisely during the exam.",
        icon: "⏱️",
        tips: [
          "Divide time by question value",
          "Skip difficult questions and return later",
          "Keep an eye on the clock",
          "Save time for review"
        ]
      }
    ],
    after: [
      {
        id: 1,
        title: "Review Your Performance",
        description: "Analyze what went well and what didn't after the exam.",
        icon: "📊",
        tips: [
          "Note down difficult questions",
          "Identify patterns in mistakes",
          "Seek clarification on unclear concepts",
          "Update your study plan based on performance"
        ]
      },
      {
        id: 2,
        title: "Celebrate Your Efforts",
        description: "Acknowledge your hard work and dedication.",
        icon: "🎉",
        tips: [
          "Take time to relax and recharge",
          "Reward yourself for your efforts",
          "Reflect on what you've learned",
          "Share your experience with peers"
        ]
      },
      {
        id: 3,
        title: "Analyze Your Performance",
        description: "Thoroughly review your exam to understand your strengths and weaknesses.",
        icon: "🔎",
        tips: [
          "Identify which topics you knew well",
          "Note where you lost points unnecessarily",
          "Look for patterns in your mistakes",
          "Compare with model answers if available"
        ]
      },
      {
        id: 4,
        title: "Seek Feedback",
        description: "Get input from teachers or peers to improve your understanding.",
        icon: "💬",
        tips: [
          "Ask specific questions about your mistakes",
          "Request clarification on unclear concepts",
          "Learn from how others approached the exam",
          "Take notes on the feedback received"
        ]
      },
      {
        id: 5,
        title: "Update Study Materials",
        description: "Incorporate what you've learned into your study resources.",
        icon: "📝",
        tips: [
          "Add notes about mistakes to avoid",
          "Update your formula sheets or cheat sheets",
          "Create new flashcards for concepts you missed",
          "Reorganize your notes based on exam performance"
        ]
      },
      {
        id: 6,
        title: "Plan Next Steps",
        description: "Use your exam experience to improve future performance.",
        icon: "🗓️",
        tips: [
          "Set specific goals for the next exam",
          "Adjust your study techniques if needed",
          "Schedule review sessions for weak areas",
          "Celebrate what you did well"
        ]
      },
      {
        id: 7,
        title: "Organize Your Notes",
        description: "Update your study materials based on exam performance.",
        icon: "🗂️",
        tips: [
          "Highlight areas that need more focus",
          "Create summary sheets for key concepts",
          "Organize notes by topic and difficulty",
          "Add exam questions to your review materials"
        ]
      },
      {
        id: 8,
        title: "Growth Mindset",
        description: "View challenges as opportunities to improve.",
        icon: "🌱",
        tips: [
          "Embrace mistakes as learning opportunities",
          "Focus on progress, not perfection",
          "Seek challenges to grow your abilities",
          "Believe in your capacity to improve"
        ]
      },
      {
        id: 9,
        title: "Wellness Check",
        description: "Take care of your physical and mental health.",
        icon: "💆",
        tips: [
          "Get adequate rest and sleep",
          "Practice stress-relief techniques",
          "Maintain a balanced diet",
          "Stay physically active"
        ]
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="exam-strategies-container">
      <button 
        onClick={handleBack} 
        className="back-button"
        aria-label="Go back to previous page"
      >
        ← Back
      </button>
      <motion.div 
        className="exam-strategies-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="exam-strategies-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Exam Success <span className="exam-strategies-gradient">Strategies</span>
        </motion.h1>
        <p className="exam-strategies-subtitle">Master the art of exam preparation with these proven strategies</p>
      </motion.div>

      <div className="exam-strategies-tabs">
        <button 
          className={`exam-strategies-tab ${activeTab === 'before' ? 'exam-strategies-tab-active' : ''}`}
          onClick={() => setActiveTab('before')}
        >
          📝 Before Exam
        </button>
        <button 
          className={`exam-strategies-tab ${activeTab === 'during' ? 'exam-strategies-tab-active' : ''}`}
          onClick={() => setActiveTab('during')}
        >
          ✍️ During Exam
        </button>
        <button 
          className={`exam-strategies-tab ${activeTab === 'after' ? 'exam-strategies-tab-active' : ''}`}
          onClick={() => setActiveTab('after')}
        >
          🏆 After Exam
        </button>
      </div>

      <motion.div 
        className="exam-strategies-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {strategies[activeTab].map((strategy) => (
          <motion.div 
            key={strategy.id}
            className="exam-strategies-card"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
          >
            <div className="exam-strategies-card-header">
              <h3 className="exam-strategies-card-title">{strategy.title}</h3>
              <div className="exam-strategies-card-icon">
                {strategy.icon}
              </div>
            </div>
            <p className="exam-strategies-card-description">{strategy.description}</p>
            <div className="exam-strategies-tips">
              <h4 className="exam-strategies-tips-title">Key Tips:</h4>
              <ul className="exam-strategies-tips-list">
                {strategy.tips.map((tip, index) => (
                  <li key={index} className="exam-strategies-tip">{tip}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ExamStrategies;