import React from 'react';
import './stu_resumeTem1.css';

// Dummy data for the resume
const dummyResumeData = {
  personalInfo: {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    linkedin: "linkedin.com/in/alexjohnson",
    portfolio: "alexjohnson.dev",
    summary: "Results-driven Full Stack Developer with 4+ years of experience in developing scalable web applications. Proficient in both front-end and back-end development, with a strong focus on creating efficient, maintainable, and user-friendly solutions. Passionate about learning new technologies and implementing innovative solutions to complex problems."
  },
  education: [
    {
      degree: "MSc in Computer Science",
      institution: "Columbia University",
      startDate: "2018",
      endDate: "2020",
      gpa: "3.9/4.0"
    },
    {
      degree: "BSc in Software Engineering",
      institution: "New York University",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.8/4.0"
    }
  ],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "New York, NY",
      startDate: "2022",
      endDate: "Present",
      responsibilities: [
        "Lead a team of 5 developers in designing and implementing new features for the company's flagship product",
        "Architected and developed a microservices-based backend system that improved API response times by 40%",
        "Mentored junior developers and conducted code reviews to ensure code quality and best practices",
        "Implemented CI/CD pipelines reducing deployment time by 60%"
      ]
    },
    {
      position: "Full Stack Developer",
      company: "Digital Solutions LLC",
      location: "New York, NY",
      startDate: "2020",
      endDate: "2022",
      responsibilities: [
        "Developed and maintained responsive web applications using React, Node.js, and MongoDB",
        "Collaborated with UX/UI designers to implement pixel-perfect interfaces",
        "Optimized application performance, reducing load times by 30%",
        "Integrated third-party APIs and services including payment gateways and authentication systems"
      ]
    },
    {
      position: "Junior Web Developer",
      company: "WebCraft Studios",
      location: "Boston, MA",
      startDate: "2018",
      endDate: "2020",
      responsibilities: [
        "Assisted in developing and maintaining client websites using HTML, CSS, and JavaScript",
        "Worked with senior developers to debug and fix issues in existing codebases",
        "Participated in agile development processes including daily stand-ups and sprint planning",
        "Created and maintained technical documentation for projects"
      ]
    }
  ],
  skills: [
    "JavaScript (ES6+)",
    "React.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Git",
    "RESTful APIs",
    "GraphQL",
    "TypeScript",
    "Python",
    "Agile/Scrum",
    "TDD",
    "CI/CD"
  ]
};

const ResumeTemplate1 = () => {
  const { personalInfo, education, experience, skills } = dummyResumeData;

  return (
    <div className="resume-container">
      <div className="resume-header">
        <div className="name-title">
          <h1>{personalInfo.name}</h1>
          <h2>{personalInfo.title}</h2>
        </div>
        <div className="contact-info">
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
          {personalInfo.linkedin && <p>LinkedIn: {personalInfo.linkedin}</p>}
          {personalInfo.portfolio && <p>Portfolio: {personalInfo.portfolio}</p>}
        </div>
      </div>

      <div className="resume-section">
        <h3>Summary</h3>
        <p>{personalInfo.summary}</p>
      </div>

      <div className="resume-section">
        <h3>Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="education-header">
              <h4>{edu.degree}</h4>
              <span className="date">{edu.startDate} - {edu.endDate || 'Present'}</span>
            </div>
            <p className="institution">{edu.institution}</p>
            {edu.gpa && <p>GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>

      <div className="resume-section">
        <h3>Professional Experience</h3>
        {experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h4>{exp.position}</h4>
              <span className="date">{exp.startDate} - {exp.endDate || 'Present'}</span>
            </div>
            <p className="company">{exp.company}, {exp.location}</p>
            <ul>
              {exp.responsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="resume-section">
        <h3>Technical Skills</h3>
        <div className="skills-container">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate1;