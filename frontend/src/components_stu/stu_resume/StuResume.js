import React, { useState, useRef } from 'react';
import { Edit2, Download, Save, Plus, X, User, Briefcase, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import html2pdf from 'html2pdf.js'; // Import html2pdf.js
import ResumeStyles from './ResumeStyle';


const StuResume = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState('template');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Refs for form inputs
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const linkedinRef = useRef();
  const websiteRef = useRef();
  const summaryRef = useRef();

  // State for dynamic arrays
  const [experienceList, setExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [previewData, setPreviewData] = useState({});

  const resumeRef = useRef();

  // Template Preview Components (unchanged)
  function ModernPreview() {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        background: 'linear-gradient(to bottom, #3b82f6 30%, white 30%)',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '12px', color: 'white' }}>
          <div style={{ height: '16px', width: '60%', background: 'white', borderRadius: '2px', marginBottom: '8px' }}></div>
          <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.7)', borderRadius: '2px' }}></div>
        </div>
        <div style={{ padding: '12px', paddingTop: '8px' }}>
          <div style={{ height: '6px', width: '30%', background: '#3b82f6', borderRadius: '2px', marginBottom: '8px' }}></div>
          <div style={{ height: '4px', width: '80%', background: '#e5e7eb', borderRadius: '2px', marginBottom: '4px' }}></div>
          <div style={{ height: '4px', width: '70%', background: '#e5e7eb', borderRadius: '2px', marginBottom: '8px' }}></div>
          <div style={{ height: '6px', width: '40%', background: '#3b82f6', borderRadius: '2px', marginBottom: '6px' }}></div>
          <div style={{ height: '4px', width: '60%', background: '#e5e7eb', borderRadius: '2px' }}></div>
        </div>
      </div>
    );
  }

  function ClassicPreview() {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        background: 'white',
        border: '2px solid #374151',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center'
      }}>
        <div style={{ height: '20px', width: '70%', background: '#374151', borderRadius: '2px', margin: '0 auto 12px' }}></div>
        <div style={{ height: '8px', width: '50%', background: '#6b7280', borderRadius: '2px', margin: '0 auto 16px' }}></div>
        <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '12px' }}>
          <div style={{ height: '6px', width: '40%', background: '#374151', borderRadius: '2px', margin: '0 auto 8px' }}></div>
          <div style={{ height: '4px', width: '80%', background: '#e5e7eb', borderRadius: '2px', margin: '0 auto 4px' }}></div>
          <div style={{ height: '4px', width: '75%', background: '#e5e7eb', borderRadius: '2px', margin: '0 auto 8px' }}></div>
          <div style={{ height: '6px', width: '45%', background: '#374151', borderRadius: '2px', margin: '0 auto 6px' }}></div>
        </div>
      </div>
    );
  }

  function CreativePreview() {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        background: 'white',
        borderRadius: '8px',
        display: 'flex',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: '35%', 
          background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
          padding: '12px' 
        }}>
          <div style={{ height: '40px', width: '40px', background: 'white', borderRadius: '50%', margin: '0 auto 12px' }}></div>
          <div style={{ height: '6px', width: '80%', background: 'rgba(255,255,255,0.8)', borderRadius: '2px', margin: '0 auto 6px' }}></div>
          <div style={{ height: '6px', width: '60%', background: 'rgba(255,255,255,0.8)', borderRadius: '2px', margin: '0 auto 12px' }}></div>
          <div style={{ height: '4px', width: '70%', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', margin: '0 auto 4px' }}></div>
          <div style={{ height: '4px', width: '50%', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', margin: '0 auto' }}></div>
        </div>
        <div style={{ flex: 1, padding: '12px' }}>
          <div style={{ height: '16px', width: '70%', background: '#1f2937', borderRadius: '2px', marginBottom: '8px' }}></div>
          <div style={{ height: '6px', width: '40%', background: '#8b5cf6', borderRadius: '2px', marginBottom: '8px' }}></div>
          <div style={{ height: '4px', width: '90%', background: '#e5e7eb', borderRadius: '2px', marginBottom: '4px' }}></div>
          <div style={{ height: '4px', width: '80%', background: '#e5e7eb', borderRadius: '2px' }}></div>
        </div>
      </div>
    );
  }

  function MinimalPreview() {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        background: 'white',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{ height: '18px', width: '60%', background: '#1f2937', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ height: '2px', width: '20%', background: '#10b981', borderRadius: '2px', marginBottom: '20px' }}></div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ height: '8px', width: '25%', background: '#10b981', borderRadius: '2px', marginBottom: '6px' }}></div>
          <div style={{ height: '4px', width: '95%', background: '#f3f4f6', borderRadius: '2px', marginBottom: '3px' }}></div>
          <div style={{ height: '4px', width: '85%', background: '#f3f4f6', borderRadius: '2px' }}></div>
        </div>
        
        <div>
          <div style={{ height: '8px', width: '30%', background: '#10b981', borderRadius: '2px', marginBottom: '6px' }}></div>
          <div style={{ height: '6px', width: '40%', background: '#e5e7eb', borderRadius: '2px', marginBottom: '4px' }}></div>
          <div style={{ height: '4px', width: '70%', background: '#f3f4f6', borderRadius: '2px' }}></div>
        </div>
      </div>
    );
  }

  function ExecutivePreview() {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        background: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '4px', height: '100px', background: 'linear-gradient(to bottom, #fbbf24, #f59e0b)' }}></div>
        
        <div style={{ height: '20px', width: '65%', background: 'white', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '8px', width: '45%', background: '#fbbf24', borderRadius: '2px', marginBottom: '16px' }}></div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ height: '6px', width: '35%', background: '#fbbf24', borderRadius: '2px', marginBottom: '6px' }}></div>
          <div style={{ height: '4px', width: '80%', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', marginBottom: '3px' }}></div>
          <div style={{ height: '4px', width: '70%', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
        </div>
        
        <div>
          <div style={{ height: '6px', width: '25%', background: '#fbbf24', borderRadius: '2px', marginBottom: '4px' }}></div>
          <div style={{ height: '4px', width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
        </div>
      </div>
    );
  }

  function TechPreview() {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        background: '#0f172a',
        borderRadius: '8px',
        padding: '16px',
        fontFamily: 'monospace',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '8px', color: '#14b8a6' }}>{'>'}_</div>
        
        <div style={{ marginTop: '16px' }}>
          <div style={{ height: '16px', width: '60%', background: '#14b8a6', borderRadius: '2px', marginBottom: '8px' }}></div>
          <div style={{ height: '6px', width: '40%', background: '#0d9488', borderRadius: '2px', marginBottom: '12px' }}></div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ height: '6px', width: '20%', background: '#64748b', borderRadius: '2px' }}></div>
          <div style={{ height: '6px', width: '25%', background: '#64748b', borderRadius: '2px' }}></div>
          <div style={{ height: '6px', width: '15%', background: '#64748b', borderRadius: '2px' }}></div>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ height: '4px', width: '30%', background: '#14b8a6', borderRadius: '2px', marginBottom: '4px' }}></div>
          <div style={{ height: '3px', width: '80%', background: '#334155', borderRadius: '2px', marginBottom: '2px' }}></div>
          <div style={{ height: '3px', width: '70%', background: '#334155', borderRadius: '2px', marginBottom: '2px' }}></div>
          <div style={{ height: '3px', width: '60%', background: '#334155', borderRadius: '2px' }}></div>
        </div>
      </div>
    );
  }

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean design with blue accents and left-aligned layout',
      preview: ModernPreview
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Traditional centered layout with elegant serif typography',
      preview: ClassicPreview
    },
    {
      id: 'creative',
      name: 'Creative Sidebar',
      description: 'Two-column layout with colorful sidebar and modern styling',
      preview: CreativePreview
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Ultra-minimalist design with green highlights',
      preview: MinimalPreview
    },
    {
      id: 'executive',
      name: 'Executive Dark',
      description: 'Professional dark theme with gold accents',
      preview: ExecutivePreview
    },
    {
      id: 'tech',
      name: 'Tech Stack',
      description: 'Developer-focused with code-like styling and teal colors',
      preview: TechPreview
    }
  ];

  // Experience handlers (unchanged)
  const addExperience = () => {
    setExperienceList([...experienceList, { 
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeExperience = (id) => {
    setExperienceList(experienceList.filter(exp => exp.id !== id));
  };

  // Education handlers (unchanged)
  const addEducation = () => {
    setEducationList([...educationList, {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    }]);
  };

  const removeEducation = (id) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
  };

  // Skills handlers (unchanged)
  const addSkill = () => {
    setSkillsList([...skillsList, {
      id: Date.now(),
      name: '',
      level: 'Intermediate'
    }]);
  };

  const removeSkill = (id) => {
    setSkillsList(skillsList.filter(skill => skill.id !== id));
  };

  // Collect all form data (unchanged)
  const collectFormData = () => {
    const formData = {
      fullName: fullNameRef.current?.value || '',
      email: emailRef.current?.value || '',
      phone: phoneRef.current?.value || '',
      address: addressRef.current?.value || '',
      linkedin: linkedinRef.current?.value || '',
      website: websiteRef.current?.value || '',
      summary: summaryRef.current?.value || '',
      experience: experienceList.map(exp => ({
        title: document.getElementById(`exp-title-${exp.id}`)?.value || '',
        company: document.getElementById(`exp-company-${exp.id}`)?.value || '',
        location: document.getElementById(`exp-location-${exp.id}`)?.value || '',
        startDate: document.getElementById(`exp-start-${exp.id}`)?.value || '',
        endDate: document.getElementById(`exp-end-${exp.id}`)?.value || '',
        description: document.getElementById(`exp-desc-${exp.id}`)?.value || ''
      })),
      education: educationList.map(edu => ({
        degree: document.getElementById(`edu-degree-${edu.id}`)?.value || '',
        school: document.getElementById(`edu-school-${edu.id}`)?.value || '',
        location: document.getElementById(`edu-location-${edu.id}`)?.value || '',
        graduationDate: document.getElementById(`edu-grad-${edu.id}`)?.value || ''
      })),
      skills: skillsList.map(skill => ({
        name: document.getElementById(`skill-name-${skill.id}`)?.value || '',
        level: document.getElementById(`skill-level-${skill.id}`)?.value || 'Intermediate'
      }))
    };
    
    return formData;
  };

  const validateResumeData = (data) => {
    const errors = [];
    
    if (!data.fullName.trim()) {
      errors.push('Full Name is required');
    }
    if (!data.email.trim()) {
      errors.push('Email is required');
    }
    if (!data.phone.trim()) {
      errors.push('Phone is required');
    }
    if (!selectedTemplate) {
      errors.push('Please select a template');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  const handleSubmit = async () => {
    const formData = collectFormData();
    const errors = validateResumeData(formData);
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreviewData({...formData, template: selectedTemplate});
      setCurrentStep('preview');
      alert('Resume generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Updated handleDownload function to generate PDF
  const handleDownload = () => {
    const resumeElement = resumeRef.current;
    if (!resumeElement) return;

    setLoading(true);

    // Define PDF options
    const opt = {
      margin: 0.5, // Margin in inches
      filename: `${previewData.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', // Standard US letter size
        orientation: 'portrait'
      }
    };

    // Generate and download PDF
    html2pdf()
      .from(resumeElement)
      .set(opt)
      .save()
      .then(() => {
        setLoading(false);
        alert('Resume downloaded successfully!');
      })
      .catch((error) => {
        setLoading(false);
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
      });
  };

  // Updated renderResumePreview to include all templates
  const renderResumePreview = () => {
    if (!previewData.template) return null;

    const { fullName, email, phone, address, linkedin, website, summary, experience, education, skills } = previewData;

    const renderCommonContent = () => (
      <>
        {summary && (
          <section className="resume-section">
            <h2 className="section-title">Professional Summary</h2>
            <p>{summary}</p>
          </section>
        )}
        {experience && experience.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Work Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="item-header">
                  <div>
                    <div className="item-title">{exp.title}</div>
                    <div className="item-subtitle">{exp.company} | {exp.location}</div>
                  </div>
                  <div className="item-meta">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                </div>
                <div className="item-description">{exp.description}</div>
              </div>
            ))}
          </section>
        )}
        {education && education.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="item-header">
                  <div>
                    <div className="item-title">{edu.degree}</div>
                    <div className="item-subtitle">{edu.school} | {edu.location}</div>
                  </div>
                  <div className="item-meta">{edu.graduationDate}</div>
                </div>
              </div>
            ))}
          </section>
        )}
        {skills && skills.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-level">{skill.level}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </>
    );

    switch (previewData.template) {
      case 'modern':
        return (
          <div className="resume-modern" ref={resumeRef}>
            <div className="resume-header">
              <h1 className="full-name">{fullName}</h1>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
                {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
                {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
                {website && <div className="contact-item"><User size={16} /> {website}</div>}
              </div>
            </div>
            <div className="resume-content">
              {renderCommonContent()}
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="resume-classic" ref={resumeRef}>
            <div className="resume-header">
              <h1 className="full-name">{fullName}</h1>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
                {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
                {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
                {website && <div className="contact-item"><User size={16} /> {website}</div>}
              </div>
            </div>
            <div className="resume-content">
              {renderCommonContent()}
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="resume-creative" ref={resumeRef}>
            <div className="sidebar">
              <h1 className="full-name">{fullName}</h1>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
                {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
                {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
                {website && <div className="contact-item"><User size={16} /> {website}</div>}
              </div>
              {skills && skills.length > 0 && (
                <section className="resume-section">
                  <h2 className="section-title">Skills</h2>
                  <div className="skills-grid">
                    {skills.map((skill, index) => (
                      <div key={index} className="skill-item">
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-level">{skill.level}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="main-content">
              {summary && (
                <section className="resume-section">
                  <h2 className="section-title">Professional Summary</h2>
                  <p>{summary}</p>
                </section>
              )}
              {experience && experience.length > 0 && (
                <section className="resume-section">
                  <h2 className="section-title">Work Experience</h2>
                  {experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="item-header">
                        <div>
                          <div className="item-title">{exp.title}</div>
                          <div className="item-subtitle">{exp.company} | {exp.location}</div>
                        </div>
                        <div className="item-meta">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </div>
                      </div>
                      <div className="item-description">{exp.description}</div>
                    </div>
                  ))}
                </section>
              )}
              {education && education.length > 0 && (
                <section className="resume-section">
                  <h2 className="section-title">Education</h2>
                  {education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="item-header">
                        <div>
                          <div className="item-title">{edu.degree}</div>
                          <div className="item-subtitle">{edu.school} | {edu.location}</div>
                        </div>
                        <div className="item-meta">{edu.graduationDate}</div>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="resume-minimal" ref={resumeRef}>
            <div className="resume-header">
              <h1 className="full-name">{fullName}</h1>
              <div className="name-underline"></div>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
                {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
                {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
                {website && <div className="contact-item"><User size={16} /> {website}</div>}
              </div>
            </div>
            <div className="resume-content">
              {renderCommonContent()}
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="resume-executive" ref={resumeRef}>
            <div className="resume-header">
              <h1 className="full-name">{fullName}</h1>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
                {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
                {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
                {website && <div className="contact-item"><User size={16} /> {website}</div>}
              </div>
            </div>
            <div className="resume-content">
              {renderCommonContent()}
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="resume-tech" ref={resumeRef}>
            <div className="resume-header">
              <h1 className="full-name">{fullName}</h1>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
                {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
                {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
                {website && <div className="contact-item"><User size={16} /> {website}</div>}
              </div>
            </div>
            <div className="resume-content">
              {renderCommonContent()}
            </div>
          </div>
        );

      default:
        return (
          <div className="resume-modern" ref={resumeRef}>
            <div className="resume-header">
              <h1 className="full-name">{fullName}</h1>
              <div className="contact-info">
                {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
                {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
              </div>
            </div>
            <div className="resume-content">
              <p>Template preview not available</p>
            </div>
          </div>
        );
    }
  };

  const TemplateSelector = ({ templates, selectedTemplate, setSelectedTemplate, setCurrentStep }) => (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Choose Your Resume Template
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Select a template that best represents your professional style
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem', 
        marginBottom: '3rem' 
      }}>
        {templates.map((template) => {
          const PreviewComponent = template.preview;
          return (
            <div
              key={template.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: selectedTemplate === template.id 
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 3px #3b82f6'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedTemplate === template.id ? 'translateY(-8px) scale(1.02)' : 'none',
                border: selectedTemplate === template.id ? '2px solid #3b82f6' : '2px solid transparent'
              }}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
                <PreviewComponent />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  color: selectedTemplate === template.id ? '#3b82f6' : '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {template.name}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {template.description}
                </p>
              </div>
              
              {selectedTemplate === template.id && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#eff6ff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#3b82f6',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedTemplate && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setCurrentStep('form')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '1rem 2.5rem',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Continue with {templates.find(t => t.id === selectedTemplate)?.name}
          </button>
        </div>
      )}
    </div>
  );

  const ResumeForm = ({
    fullNameRef, emailRef, phoneRef, addressRef, linkedinRef, websiteRef, summaryRef,
    experienceList, addExperience, removeExperience,
    educationList, addEducation, removeEducation,
    skillsList, addSkill, removeSkill,
    setCurrentStep, handleSubmit, loading
  }) => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '2rem', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            Build Your Resume
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Fill in your information to generate your resume
          </p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {/* Personal Information */}
          <section style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <User style={{ marginRight: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
              Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                ref={fullNameRef}
                type="text"
                placeholder="Full Name"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
              />
              <input
                ref={emailRef}
                type="email"
                placeholder="Email Address"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
              />
              <input
                ref={phoneRef}
                type="tel"
                placeholder="Phone Number"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
              />
              <input
                ref={addressRef}
                type="text"
                placeholder="Address"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
              />
              <input
                ref={linkedinRef}
                type="url"
                placeholder="LinkedIn Profile"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
              />
              <input
                ref={websiteRef}
                type="url"
                placeholder="Website/Portfolio"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>
          </section>

          {/* Professional Summary */}
          <section style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Professional Summary</h3>
            <textarea
              ref={summaryRef}
              placeholder="Write a brief professional summary..."
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </section>

          {/* Experience */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center' }}>
                <Briefcase style={{ marginRight: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
                Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                Add Experience
              </button>
            </div>
            {experienceList.map((exp) => (
              <div key={exp.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                >
                  <X />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    id={`exp-title-${exp.id}`}
                    type="text"
                    placeholder="Job Title"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                  <input
                    id={`exp-company-${exp.id}`}
                    type="text"
                    placeholder="Company Name"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                  <input
                    id={`exp-location-${exp.id}`}
                    type="text"
                    placeholder="Location"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      id={`exp-start-${exp.id}`}
                      type="month"
                      placeholder="Start Date"
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                    />
                    <input
                      id={`exp-end-${exp.id}`}
                      type="month"
                      placeholder="End Date"
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                    />
                  </div>
                </div>
                <textarea
                  id={`exp-desc-${exp.id}`}
                  placeholder="Job description and achievements..."
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            ))}
          </section>

          {/* Education */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center' }}>
                <GraduationCap style={{ marginRight: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
                Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                Add Education
              </button>
            </div>
            {educationList.map((edu) => (
              <div key={edu.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                >
                  <X />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <input
                    id={`edu-degree-${edu.id}`}
                    type="text"
                    placeholder="Degree"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                  <input
                    id={`edu-school-${edu.id}`}
                    type="text"
                    placeholder="School/University"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                  <input
                    id={`edu-location-${edu.id}`}
                    type="text"
                    placeholder="Location"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                  <input
                    id={`edu-grad-${edu.id}`}
                    type="month"
                    placeholder="Graduation Date"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>Skills</h3>
              <button
                type="button"
                onClick={addSkill}
                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                Add Skill
              </button>
            </div>
            {skillsList.map((skill) => (
              <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  id={`skill-name-${skill.id}`}
                  type="text"
                  placeholder="Skill name"
                  style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
                />
                <select
                  id={`skill-level-${skill.id}`}
                  defaultValue="Intermediate"
                  style={{ padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', background: 'white', cursor: 'pointer' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                >
                  <X />
                </button>
              </div>
            ))}
          </section>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={() => setCurrentStep('template')}
              style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 2rem', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }}
            >
              Back to Templates
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{ 
                backgroundColor: loading ? '#9ca3af' : '#3b82f6', 
                color: 'white', 
                padding: '0.75rem 2rem', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '1rem', 
                fontWeight: '500', 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <Save style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
              {loading ? 'Generating...' : 'Generate Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <ResumeStyles />
      {currentStep === 'template' && (
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 'form' && (
        <ResumeForm
          fullNameRef={fullNameRef}
          emailRef={emailRef}
          phoneRef={phoneRef}
          addressRef={addressRef}
          linkedinRef={linkedinRef}
          websiteRef={websiteRef}
          summaryRef={summaryRef}
          experienceList={experienceList}
          addExperience={addExperience}
          removeExperience={removeExperience}
          educationList={educationList}
          addEducation={addEducation}
          removeEducation={removeEducation}
          skillsList={skillsList}
          addSkill={addSkill}
          removeSkill={removeSkill}
          setCurrentStep={setCurrentStep}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {currentStep === 'preview' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: '1.5rem 2rem', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                Resume Preview
              </h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setCurrentStep('form')}
                  style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Edit2 style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                  Edit
                </button>
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  style={{ 
                    backgroundColor: loading ? '#9ca3af' : '#10b981', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontSize: '0.9rem', 
                    fontWeight: '500', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}
                >
                  <Download style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                  {loading ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              {renderResumePreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StuResume;