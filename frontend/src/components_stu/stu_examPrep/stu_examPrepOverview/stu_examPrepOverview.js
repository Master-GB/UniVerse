import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './stu_examPrepOverview.css';


const examPrepImage = '/resourses/gh.jpg';

const ExamPrepOverview = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    // Set initial animation state
    setIsVisible(true);
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all section refs
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const registerSectionRef = (section, ref) => {
    if (ref) {
      sectionRefs.current[section] = ref;
    }
  };

  const examCategories = [
    { 
      id: 1,
      title: 'Practice Tests',
      description: 'Take timed practice tests to assess your knowledge and improve time management.',
      icon: '📝',
      path: '/s/student/exam/practice-tests',
      color: '#4e73df'
    },
    {
      id: 3,
      title: 'Past Papers',
      description: 'Solve previous years\' exam papers with model answers.',
      icon: '📄',
      path: '/s/student/exam/past-papers'
    },
    {
      id: 4,
      title: 'Exam Strategies',
      description: 'Learn effective exam techniques and time management strategies.',
      icon: '🎯',
      path: '/s/student/exam/strategies'
    }
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="exam-prep-container"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >

      <motion.div 
        className="exam-prep-hero"
        ref={el => registerSectionRef('hero', el)}
        variants={itemVariants}
      >
        <div className="hero-content">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Access Your Exams with Confidence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Access a wide range of resources designed to help you prepare effectively for your upcoming exams.
          </motion.p>
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { number: '100+', label: 'Practice Tests' },
              { number: '10+', label: 'Years of Papers' },
              { number: '30+', label: 'Exam Strategies' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="stat-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <img src={examPrepImage} alt="Exam Preparation" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="exam-categories"
        ref={el => registerSectionRef('categories', el)}
        variants={itemVariants}
      >
        <h2>Get Started</h2>
        <motion.div 
          className="category-grid"
          variants={containerVariants}
        >
          <AnimatePresence>
            {examCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className={`category-card ${hoveredCard === category.id ? 'hovered' : ''}`}
                onClick={() => handleCategoryClick(category.path)}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ 
                  delay: 0.1 * index,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <span className="learn-more">Explore</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div 
        className="exam-tips"
        ref={el => registerSectionRef('tips', el)}
        variants={itemVariants}
      >
        <h2>Exam Success Tips</h2>
        <motion.div 
          className="tips-grid"
          variants={containerVariants}
        >
          {[
            {
              title: "Plan Your Study",
              content: "Create a realistic study schedule and stick to it. Break down your subjects into manageable chunks.",
              icon: "📅"
            },
            {
              title: "Practice Regularly",
              content: "Consistent practice with past papers and sample questions is key to exam success.",
              icon: "✍️"
            },
            {
              title: "Active Learning",
              content: "Engage with the material actively through summarization, teaching others, or creating mind maps.",
              icon: "🧠"
            },
            {
              title: "Time Management",
              content: "Allocate specific time slots for each subject and take regular breaks to maintain focus.",
              icon: "⏱️"
            },
            {
              title: "Stay Healthy",
              content: "Don't neglect sleep, exercise, and proper nutrition during your exam preparation.",
              icon: "🍎"
            },
            {
              title: "Exam Strategy",
              content: "Learn to identify high-value questions and manage your time effectively during the exam.",
              icon: "🎯"
            },
            {
              title: "Mindful Breaks",
              content: "Take short, mindful breaks during study sessions to maintain focus and prevent burnout.",
              icon: "🧘"
            },
            {
              title: "Group Study",
              content: "Collaborate with peers to discuss difficult concepts and test each other's understanding.",
              icon: "👥"
            },
            {
              title: "Confidence Building",
              content: "Review past successes and focus on your preparation to boost confidence before the exam.",
              icon: "💪"
            }
          ].map((tip, index) => (
            <motion.div 
              key={tip.title}
              className="tip-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: 0.1 * index,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="tip-header">
                <span className="tip-icon">{tip.icon}</span>
                <h3>{tip.title}</h3>
              </div>
              <p>{tip.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ExamPrepOverview;