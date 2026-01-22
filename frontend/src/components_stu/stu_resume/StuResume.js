import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Download, Save, Plus, X, User, Briefcase, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import ResumeStyles from './ResumeStyle';
import './ResumeAnimated.css';



const StuResume = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState('template');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    summary: ''
  });
  const [experienceList, setExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [previewData, setPreviewData] = useState({});
  const resumeRef = useRef();

  // Template preview components
  const ModernPreview = () => (
    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(to bottom, #4f46e5 30%, #0f172a 30%)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '12px', color: 'white' }}>
        <div style={{ height: '16px', width: '60%', background: 'white', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.8)', borderRadius: '2px' }}></div>
      </div>
      <div style={{ padding: '12px', paddingTop: '1px' }}>
        <div style={{ height: '6px', width: '30%', background: '#60a5fa', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '4px', width: '80%', background: '#334155', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ height: '4px', width: '70%', background: '#334155', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '6px', width: '40%', background: '#60a5fa', borderRadius: '2px', marginBottom: '6px' }}></div>
        <div style={{ height: '4px', width: '60%', background: '#334155', borderRadius: '2px' }}></div>
      </div>
    </div>
  );

  const ClassicPreview = () => (
    <div style={{ width: '100%', height: '200px', background: '#1e293b', border: '2px solid #fbbf24', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
      <div style={{ height: '20px', width: '70%', background: '#fbbf24', borderRadius: '2px', margin: '0 auto 12px' }}></div>
      <div style={{ height: '8px', width: '50%', background: '#cbd5e1', borderRadius: '2px', margin: '0 auto 16px' }}></div>
      <div style={{ borderTop: '1px solid #475569', paddingTop: '12px' }}>
        <div style={{ height: '6px', width: '40%', background: '#fbbf24', borderRadius: '2px', margin: '0 auto 8px' }}></div>
        <div style={{ height: '4px', width: '80%', background: '#475569', borderRadius: '2px', margin: '0 auto 4px' }}></div>
        <div style={{ height: '4px', width: '75%', background: '#475569', borderRadius: '2px', margin: '0 auto 8px' }}></div>
        <div style={{ height: '6px', width: '45%', background: '#fbbf24', borderRadius: '2px', margin: '0 auto 6px' }}></div>
      </div>
    </div>
  );

  const CreativePreview = () => (
    <div style={{ width: '100%', height: '200px', background: '#0f172a', borderRadius: '8px', display: 'flex', overflow: 'hidden', border: '1px solid #a78bfa' }}>
      <div style={{ width: '35%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '12px' }}>
        <div style={{ height: '40px', width: '40px', background: 'white', borderRadius: '50%', margin: '0 auto 12px' }}></div>
        <div style={{ height: '6px', width: '80%', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', margin: '0 auto 6px' }}></div>
        <div style={{ height: '6px', width: '60%', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', margin: '0 auto 12px' }}></div>
        <div style={{ height: '4px', width: '70%', background: 'rgba(255,255,255,0.7)', borderRadius: '2px', margin: '0 auto 4px' }}></div>
        <div style={{ height: '4px', width: '50%', background: 'rgba(255,255,255,0.7)', borderRadius: '2px', margin: '0 auto' }}></div>
      </div>
      <div style={{ flex: 1, padding: '12px', background: '#0f172a' }}>
        <div style={{ height: '16px', width: '70%', background: '#e2e8f0', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '6px', width: '40%', background: '#a78bfa', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '4px', width: '90%', background: '#334155', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ height: '4px', width: '80%', background: '#334155', borderRadius: '2px' }}></div>
      </div>
    </div>
  );

  const MinimalPreview = () => (
    <div style={{ width: '100%', height: '200px', background: '#0c1221', borderRadius: '8px', padding: '20px', border: '1px solid #38bdf8' }}>
      <div style={{ height: '18px', width: '60%', background: '#ffffff', borderRadius: '2px', marginBottom: '4px' }}></div>
      <div style={{ height: '2px', width: '20%', background: '#38bdf8', borderRadius: '2px', marginBottom: '20px' }}></div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ height: '8px', width: '25%', background: '#38bdf8', borderRadius: '2px', marginBottom: '6px' }}></div>
        <div style={{ height: '4px', width: '95%', background: '#1e293b', borderRadius: '2px', marginBottom: '3px' }}></div>
        <div style={{ height: '4px', width: '85%', background: '#1e293b', borderRadius: '2px' }}></div>
      </div>
      <div>
        <div style={{ height: '8px', width: '30%', background: '#38bdf8', borderRadius: '2px', marginBottom: '6px' }}></div>
        <div style={{ height: '6px', width: '40%', background: '#475569', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ height: '4px', width: '70%', background: '#1e293b', borderRadius: '2px' }}></div>
      </div>
    </div>
  );

  const ExecutivePreview = () => (
    <div style={{ width: '100%', height: '200px', background: '#080b13', borderRadius: '8px', padding: '16px', color: 'white', position: 'relative', border: '1px solid #fbbf24' }}>
      <div style={{ position: 'absolute', top: '12px', right: '12px', width: '4px', height: '100px', background: 'linear-gradient(to bottom, #fbbf24, #f59e0b)' }}></div>
      <div style={{ height: '20px', width: '65%', background: '#fbbf24', borderRadius: '2px', marginBottom: '8px' }}></div>
      <div style={{ height: '8px', width: '45%', background: '#cbd5e1', borderRadius: '2px', marginBottom: '16px' }}></div>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ height: '6px', width: '35%', background: '#fbbf24', borderRadius: '2px', marginBottom: '6px' }}></div>
        <div style={{ height: '4px', width: '80%', background: '#334155', borderRadius: '2px', marginBottom: '3px' }}></div>
        <div style={{ height: '4px', width: '70%', background: '#334155', borderRadius: '2px' }}></div>
      </div>
      <div>
        <div style={{ height: '6px', width: '25%', background: '#fbbf24', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ height: '4px', width: '60%', background: '#334155', borderRadius: '2px' }}></div>
      </div>
    </div>
  );

  const TechPreview = () => (
    <div style={{ width: '100%', height: '200px', background: '#020617', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', position: 'relative', border: '1px solid #0ea5e9' }}>
      <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '8px', color: '#22d3ee' }}>{'>'}_</div>
      <div style={{ marginTop: '16px' }}>
        <div style={{ height: '16px', width: '60%', background: '#14b8a6', borderRadius: '2px', marginBottom: '8px' }}></div>
        <div style={{ height: '6px', width: '40%', background: '#0d9488', borderRadius: '2px', marginBottom: '12px' }}></div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ height: '6px', width: '20%', background: '#94a3b8', borderRadius: '2px' }}></div>
        <div style={{ height: '6px', width: '25%', background: '#94a3b8', borderRadius: '2px' }}></div>
        <div style={{ height: '6px', width: '15%', background: '#94a3b8', borderRadius: '2px' }}></div>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ height: '4px', width: '30%', background: '#14b8a6', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ height: '3px', width: '80%', background: '#334155', borderRadius: '2px', marginBottom: '2px' }}></div>
        <div style={{ height: '3px', width: '70%', background: '#334155', borderRadius: '2px', marginBottom: '2px' }}></div>
        <div style={{ height: '3px', width: '60%', background: '#334155', borderRadius: '2px' }}></div>
      </div>
    </div>
  );

  const templates = [
    { id: 'modern', name: 'Modern Professional', description: 'Clean design with blue accents', preview: ModernPreview },
    { id: 'classic', name: 'Classic Traditional', description: 'Traditional centered layout', preview: ClassicPreview },
    { id: 'creative', name: 'Creative Sidebar', description: 'Two-column colorful layout', preview: CreativePreview },
    { id: 'minimal', name: 'Minimal Clean', description: 'Ultra-minimalist design', preview: MinimalPreview },
    { id: 'executive', name: 'Executive Dark', description: 'Professional dark theme', preview: ExecutivePreview },
    { id: 'tech', name: 'Tech Stack', description: 'Developer-focused styling', preview: TechPreview }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  

  const updateExperience = (id, field, value) => {
    setExperienceList(experienceList.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducationList([...educationList, { 
      id: Date.now(), 
      degree: '', 
      school: '', 
      location: '', 
      graduationDate: '' 
    }]);
  };

  const removeEducation = (id) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
  };

  const updateEducation = (id, field, value) => {
    setEducationList(educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

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

  const updateSkill = (id, field, value) => {
    setSkillsList(skillsList.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const handleSubmit = async () => {
    const allData = { 
      ...formData, 
      experience: [...experienceList], 
      education: [...educationList], 
      skills: [...skillsList],
      template: selectedTemplate
    };
    
    if (!allData.fullName?.trim() || !allData.email?.trim() || !allData.phone?.trim()) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    setLoading(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Ensure template is set, default to 'modern' if not
      const previewData = {
        ...allData,
        template: selectedTemplate || 'modern'
      };

      console.log('Setting preview data:', previewData);
      setPreviewData(previewData);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Error generating resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeRef.current) {
      alert('Resume not found. Please try again.');
      return;
    }
    
    setLoading(true);
    try {
      // Load html2pdf library dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      
      // Wait for script to load
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load PDF library'));
        document.head.appendChild(script);
      });

      // Check if html2pdf is available
      if (!window.html2pdf) {
        throw new Error('PDF library not loaded');
      }

      // Hide SVG icons temporarily (they cause errors in PDF generation)
      const svgElements = resumeRef.current.querySelectorAll('svg');
      svgElements.forEach(svg => {
        svg.style.display = 'none';
      });

      const opt = {
        margin: 0.5,
        filename: `${previewData.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };
      
      await window.html2pdf().from(resumeRef.current).set(opt).save();
      
      // Restore SVG icons after PDF generation
      svgElements.forEach(svg => {
        svg.style.display = '';
      });
      
      // Clean up script after download
      document.head.removeChild(script);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
      
      // Restore SVG icons in case of error
      const svgElements = resumeRef.current?.querySelectorAll('svg');
      if (svgElements) {
        svgElements.forEach(svg => {
          svg.style.display = '';
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Add template class to body when in preview mode
  useEffect(() => {
    if (currentStep === 'preview') {
      document.body.classList.add('resume-preview');
      return () => {
        document.body.classList.remove('resume-preview');
      };
    }
  }, [currentStep]);

  const renderResumePreview = () => {
    if (!previewData.template) return null;
    const { fullName, email, phone, address, linkedin, website, summary, experience = [], education = [], skills = [], template } = previewData;

    // Debug log to verify template value
    console.log('Rendering template:', template);

    // Map template IDs to their corresponding CSS class names
    const templateClass = {
      modern: 'resume-modern',
      classic: 'resume-classic',
      creative: 'resume-creative',
      minimal: 'resume-minimal',
      executive: 'resume-executive',
      tech: 'resume-tech'
    }[template] || 'resume-modern';

    const renderContactItems = () => (
      <>
        {email && <div className="contact-item"><Mail size={16} /> {email}</div>}
        {phone && <div className="contact-item"><Phone size={16} /> {phone}</div>}
        {address && <div className="contact-item"><MapPin size={16} /> {address}</div>}
        {linkedin && <div className="contact-item"><Briefcase size={16} /> {linkedin}</div>}
        {website && <div className="contact-item"><User size={16} /> {website}</div>}
      </>
    );

    const renderSummarySection = () => (
      summary ? (
        <section className="resume-section">
          <h2 className="section-title">Professional Summary</h2>
          <p>{summary}</p>
        </section>
      ) : null
    );

    const renderExperienceSection = () => (
      experience && experience.length > 0 ? (
        <section className="resume-section">
          <h2 className="section-title">Work Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="experience-item">
              <div className="item-header">
                <div>
                  <div className="item-title">{exp.title}</div>
                  <div className="item-subtitle">{exp.company} | {exp.location}</div>
                </div>
                <div>{exp.startDate} - {exp.endDate || 'Present'}</div>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      ) : null
    );

    const renderEducationSection = () => (
      education && education.length > 0 ? (
        <section className="resume-section">
          <h2 className="section-title">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="education-item">
              <div className="item-header">
                <div>
                  <div className="item-title">{edu.degree}</div>
                  <div className="item-subtitle">{edu.school} | {edu.location}</div>
                </div>
                <div>{edu.graduationDate}</div>
              </div>
            </div>
          ))}
        </section>
      ) : null
    );

    const renderSkillsSection = () => (
      skills && skills.length > 0 ? (
        <section className="resume-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-item">
                <div>{skill.name}</div>
                <div>{skill.level}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null
    );

    if (template === 'creative') {
      return (
        <div className={`resume-template ${templateClass}`} ref={resumeRef}>
          <div className="sidebar">
            <h1 className="full-name">{fullName}</h1>
            <div className="contact-info">{renderContactItems()}</div>
            {skills && skills.length > 0 && (
              <section className="resume-section">
                <h2 className="section-title">Skills</h2>
                <div className="skills-grid">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="skill-item">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-level">{skill.level}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="main-content">
            {renderSummarySection()}
            {renderExperienceSection()}
            {renderEducationSection()}
          </div>
        </div>
      );
    }

    return (
      <div className={`resume-template ${templateClass}`} ref={resumeRef}>
        <div className="resume-header">
          <h1 className="full-name">{fullName}</h1>
          <div className="contact-info">{renderContactItems()}</div>
        </div>
        <div className="resume-content">
          {renderSummarySection()}
          {renderExperienceSection()}
          {renderEducationSection()}
          {renderSkillsSection()}
        </div>
      </div>
    );
  };

  if (currentStep === 'template') {
    return (
      <div className="resume-page" style={{
        minHeight: '100vh',
        padding: '-50px',
        marginTop:'-80px',
        background: 'radial-gradient(1000px 600px at 10% -10%, rgba(91, 156, 255, 0.25), transparent), radial-gradient(1000px 600px at 100% 0%, rgba(74, 139, 245, 0.2), transparent), var(--bg)'
      }}>
        <ResumeStyles />
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#FFFFFF' }}>Choose Your Resume Template</h1>
            <p style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>Select a template that best represents your style</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {templates.map((template) => {
              const PreviewComponent = template.preview;
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  style={{
                    background: '#1e293b',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    border: selectedTemplate === template.id ? '3px solid #3b82f6' : '2px solid #334155',
                    transition: 'all 0.3s',
                    transform: selectedTemplate === template.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedTemplate === template.id ? '0 10px 25px rgba(59, 130, 246, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <PreviewComponent />
                  </div>
                  
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#ffffff' }}>
                    {template.name}
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#3b82f6', borderRadius: '6px', textAlign: 'center', color: '#ffffff', fontWeight: '500' }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {selectedTemplate && (
            <div style={{ textAlign: 'center' }}>
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
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'form') {
    return (
      <div className="resume-page resume-animated-bg" style={{
        minHeight: '100vh',
        padding: '0',
        marginTop:'-80px',
        background: 'radial-gradient(1000px 600px at 10% -10%, rgba(127, 91, 255, 0.1), transparent), radial-gradient(1000px 600px at 100% 0%, rgba(91, 156, 255, 0.08), transparent), #0c0f14',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ResumeStyles />
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '2rem', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#ffffff' }}>Build Your Resume</h2>
            
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#f1f5f9' }}>
                <User style={{ marginRight: '0.5rem' }} /> Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name *" style={{ padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', fontSize: '1rem', background: '#0f172a', color: '#e2e8f0' }} />
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email *" style={{ padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', fontSize: '1rem', background: '#0f172a', color: '#e2e8f0' }} />
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Phone *" style={{ padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', fontSize: '1rem', background: '#0f172a', color: '#e2e8f0' }} />
                <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" style={{ padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', fontSize: '1rem', background: '#0f172a', color: '#e2e8f0' }} />
                <input name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn" style={{ padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', fontSize: '1rem', background: '#0f172a', color: '#e2e8f0' }} />
                <input name="website" value={formData.website} onChange={handleInputChange} placeholder="Website" style={{ padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', fontSize: '1rem', background: '#0f172a', color: '#e2e8f0' }} />
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem', color: '#f1f5f9' }}>Professional Summary</h3>
              <textarea name="summary" value={formData.summary} onChange={handleInputChange} placeholder="Brief professional summary..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #475569', borderRadius: '6px', minHeight: '100px', fontSize: '1rem', fontFamily: 'inherit', background: '#0f172a', color: '#e2e8f0' }} />
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', display: 'flex', alignItems: 'center', color: '#f1f5f9' }}>
                  <Briefcase style={{ marginRight: '0.5rem' }} /> Work Experience
                </h3>
                <button onClick={addExperience} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add
                </button>
              </div>
              {experienceList.map((exp) => (
                <div key={exp.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative', border: '1px solid #334155' }}>
                  <button onClick={() => removeExperience(exp.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <X />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} placeholder="Job Title" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} placeholder="Location" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} type="month" placeholder="Start Date" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} type="month" placeholder="End Date" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Description..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', minHeight: '60px', fontFamily: 'inherit', background: '#1e293b', color: '#e2e8f0' }} />
                </div>
              ))}
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', display: 'flex', alignItems: 'center', color: '#f1f5f9' }}>
                  <GraduationCap style={{ marginRight: '0.5rem' }} /> Education
                </h3>
                <button onClick={addEducation} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add
                </button>
              </div>
              {educationList.map((edu) => (
                <div key={edu.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative', border: '1px solid #334155' }}>
                  <button onClick={() => removeEducation(edu.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <X />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Degree" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="School" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={edu.location} onChange={(e) => updateEducation(edu.id, 'location', e.target.value)} placeholder="Location" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                    <input value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} type="month" placeholder="Graduation Date" style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#1e293b', color: '#e2e8f0' }} />
                  </div>
                </div>
              ))}
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#f1f5f9' }}>Skills</h3>
                <button onClick={addSkill} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add
                </button>
              </div>
              {skillsList.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <input value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name" style={{ flex: 1, padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#0f172a', color: '#e2e8f0' }} />
                  <select value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', e.target.value)} style={{ padding: '0.5rem', border: '1px solid #475569', borderRadius: '4px', background: '#0f172a', color: '#e2e8f0' }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button onClick={() => removeSkill(skill.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <X />
                  </button>
                </div>
              ))}
            </section>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
              <button onClick={() => setCurrentStep('template')} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 2rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ backgroundColor: loading ? '#9ca3af' : '#3b82f6', color: 'white', padding: '0.75rem 2rem', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
                <Save size={16} style={{ marginRight: '0.5rem' }} />
                {loading ? 'Generating...' : 'Generate Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'preview') {
    return (
      <div className="resume-page resume-animated-bg preview-container" style={{
        minHeight: '100vh',
        padding: '0',
        marginTop: '80px',
        background: 'radial-gradient(1000px 600px at 10% -10%, rgba(127, 91, 255, 0.1), transparent), radial-gradient(1000px 600px at 100% 0%, rgba(91, 156, 255, 0.08), transparent), #0c0f14',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        overflow: 'auto'
      }}>
        <ResumeStyles />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{ borderBottom: '1px solid #334155', padding: '1.5rem 2rem', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff' }}>Resume Preview</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setCurrentStep('form')} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Edit2 size={16} style={{ marginRight: '0.5rem' }} /> Edit
                </button>
                <button onClick={handleDownload} disabled={loading} style={{ backgroundColor: loading ? '#9ca3af' : '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Download size={16} style={{ marginRight: '0.5rem' }} />
                  {loading ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>
            </div>
            <div style={{ padding: '2rem', background: '#1e293b' }}>
              {renderResumePreview()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StuResume;