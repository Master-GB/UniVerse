import React, { useState, useRef } from 'react';
import { Edit2, Download, Save, Plus, X, User, Briefcase, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import './StuResume.css';

const ResumeBuilder = () => {
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

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      color: 'blue',
      preview: 'Clean and contemporary design with blue accents'
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      color: 'gray',
      preview: 'Traditional layout with elegant typography'
    },
    {
      id: 'creative',
      name: 'Creative Design',
      color: 'purple',
      preview: 'Bold and creative with colorful elements'
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      color: 'green',
      preview: 'Minimalist design focused on content'
    }
  ];

  // Experience handlers
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

  // Education handlers
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

  // Skills handlers
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

  // Collect all form data
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
      const payload = {
        studentId: "64f1c2e2b1e2c2a1b2c3d4e5",
        template: selectedTemplate,
        personalInfo: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          linkedin: formData.linkedin.trim(),
          website: formData.website.trim()
        },
        summary: formData.summary.trim(),
        experience: formData.experience.filter(exp => exp.title.trim() || exp.company.trim()),
        education: formData.education.filter(edu => edu.degree.trim() || edu.school.trim()),
        skills: formData.skills.filter(skill => skill.name.trim()),
        projects: [],
        certifications: []
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:8070/resumes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          alert(`Error: ${errorData.message || errorData.error || 'Failed to save resume'}`);
        } catch (e) {
          alert(`Server error: ${response.status} - ${errorText}`);
        }
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);
      
      setPreviewData(formData);
      setCurrentStep('preview');
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error: Unable to connect to server. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const TemplateSelector = ({ templates, selectedTemplate, setSelectedTemplate, setCurrentStep }) => (
    <div className="template-selector-res">
      <div className="template-header-res">
        <h1>Choose Your Resume Template</h1>
        <p>Select a template that best represents your professional style</p>
      </div>
      
      <div className="template-grid-res">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card-res ${selectedTemplate === template.id ? 'selected-res' : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className={`template-preview-res ${template.color}-res`}>
              <User className="template-icon-res" />
            </div>
            <h3>{template.name}</h3>
            <p>{template.preview}</p>
          </div>
        ))}
      </div>
      
      {selectedTemplate && (
        <div className="continue-section-res">
          <button
            onClick={() => setCurrentStep('form')}
            className="continue-btn-res"
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
    <div className="resume-form-container-res">
      <div className="form-card-res">
        <div className="form-header-res">
          <h2>Build Your Resume</h2>
          <p>Fill in your information to generate your resume</p>
        </div>
        
        <div className="form-content-res">
          {/* Personal Information */}
          <section className="form-section-res">
            <h3>
              <User className="section-icon-res" />
              Personal Information
            </h3>
            <div className="input-grid-res">
              <input
                ref={fullNameRef}
                type="text"
                placeholder="Full Name"
                className="form-input-res"
                defaultValue=""
              />
              <input
                ref={emailRef}
                type="email"
                placeholder="Email Address"
                className="form-input-res"
                defaultValue=""
              />
              <input
                ref={phoneRef}
                type="tel"
                placeholder="Phone Number"
                className="form-input-res"
                defaultValue=""
              />
              <input
                ref={addressRef}
                type="text"
                placeholder="Address"
                className="form-input-res"
                defaultValue=""
              />
              <input
                ref={linkedinRef}
                type="url"
                placeholder="LinkedIn Profile"
                className="form-input-res"
                defaultValue=""
              />
              <input
                ref={websiteRef}
                type="url"
                placeholder="Website/Portfolio"
                className="form-input-res"
                defaultValue=""
              />
            </div>
          </section>

          {/* Professional Summary */}
          <section className="form-section-res">
            <h3>Professional Summary</h3>
            <textarea
              ref={summaryRef}
              placeholder="Write a brief professional summary..."
              className="form-textarea-res"
              defaultValue=""
            />
          </section>

          {/* Experience */}
          <section className="form-section-res">
            <div className="section-header-res">
              <h3>
                <Briefcase className="section-icon-res" />
                Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="add-btn-res"
              >
                <Plus className="btn-icon-res" />
                Add Experience
              </button>
            </div>
            {experienceList.map((exp) => (
              <div key={exp.id} className="array-item-res">
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="remove-btn-res"
                >
                  <X />
                </button>
                <div className="input-grid-res">
                  <input
                    id={`exp-title-${exp.id}`}
                    type="text"
                    placeholder="Job Title"
                    className="form-input-res"
                    defaultValue=""
                  />
                  <input
                    id={`exp-company-${exp.id}`}
                    type="text"
                    placeholder="Company Name"
                    className="form-input-res"
                    defaultValue=""
                  />
                  <input
                    id={`exp-location-${exp.id}`}
                    type="text"
                    placeholder="Location"
                    className="form-input-res"
                    defaultValue=""
                  />
                  <div className="date-inputs-res">
                    <input
                      id={`exp-start-${exp.id}`}
                      type="month"
                      placeholder="Start Date"
                      className="form-input-res"
                      defaultValue=""
                    />
                    <input
                      id={`exp-end-${exp.id}`}
                      type="month"
                      placeholder="End Date"
                      className="form-input-res"
                      defaultValue=""
                    />
                  </div>
                </div>
                <textarea
                  id={`exp-desc-${exp.id}`}
                  placeholder="Job description and achievements..."
                  className="form-textarea-res small-res"
                  defaultValue=""
                />
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="form-section-res">
            <div className="section-header-res">
              <h3>
                <GraduationCap className="section-icon-res" />
                Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="add-btn-res"
              >
                <Plus className="btn-icon-res" />
                Add Education
              </button>
            </div>
            {educationList.map((edu) => (
              <div key={edu.id} className="array-item-res">
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="remove-btn-res"
                >
                  <X />
                </button>
                <div className="input-grid-res">
                  <input
                    id={`edu-degree-${edu.id}`}
                    type="text"
                    placeholder="Degree"
                    className="form-input-res"
                    defaultValue=""
                  />
                  <input
                    id={`edu-school-${edu.id}`}
                    type="text"
                    placeholder="School/University"
                    className="form-input-res"
                    defaultValue=""
                  />
                  <input
                    id={`edu-location-${edu.id}`}
                    type="text"
                    placeholder="Location"
                    className="form-input-res"
                    defaultValue=""
                  />
                  <input
                    id={`edu-grad-${edu.id}`}
                    type="month"
                    placeholder="Graduation Date"
                    className="form-input-res"
                    defaultValue=""
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="form-section-res">
            <div className="section-header-res">
              <h3>Skills</h3>
              <button
                type="button"
                onClick={addSkill}
                className="add-btn-res"
              >
                <Plus className="btn-icon-res" />
                Add Skill
              </button>
            </div>
            {skillsList.map((skill) => (
              <div key={skill.id} className="skill-item-res">
                <input
                  id={`skill-name-${skill.id}`}
                  type="text"
                  placeholder="Skill name"
                  className="form-input-res"
                  defaultValue=""
                />
                <select
                  id={`skill-level-${skill.id}`}
                  className="form-select-res"
                  defaultValue="Intermediate"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="remove-btn-res small-res"
                >
                  <X />
                </button>
              </div>
            ))}
          </section>

          <div className="form-actions-res">
            <button
              type="button"
              onClick={() => setCurrentStep('template')}
              className="back-btn-res"
            >
              Back to Templates
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="submit-btn-res"
              disabled={loading}
            >
              <Save className="btn-icon-res" />
              {loading ? 'Saving...' : 'Generate Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ModernTemplate = ({ previewData }) => (
    <div className="resume-template-res modern-res">
      <div className="resume-header-res">
        <h1 className="full-name-res">{previewData.fullName || ''}</h1>
        <div className="contact-info-res">
          {previewData.email && (
            <div className="contact-item-res">
              <Mail className="contact-icon-res" />
              {previewData.email}
            </div>
          )}
          {previewData.phone && (
            <div className="contact-item-res">
              <Phone className="contact-icon-res" />
              {previewData.phone}
            </div>
          )}
          {previewData.address && (
            <div className="contact-item-res">
              <MapPin className="contact-icon-res" />
              {previewData.address}
            </div>
          )}
        </div>
      </div>
      
      <div className="resume-content-res">
        {previewData.summary && (
          <section className="resume-section-res">
            <h2 className="section-title-res">Professional Summary</h2>
            <p className="summary-text-res">{previewData.summary}</p>
          </section>
        )}

        {previewData.experience && previewData.experience.length > 0 && (
          <section className="resume-section-res">
            <h2 className="section-title-res">Work Experience</h2>
            {previewData.experience.map((exp, index) => (
              <div key={index} className="experience-item-res">
                <div className="experience-header-res">
                  <div>
                    <h3 className="job-title-res">{exp.title}</h3>
                    <p className="company-name-res">{exp.company}</p>
                  </div>
                  <div className="date-location-res">
                    <p>{exp.location}</p>
                    <p className="dates-res">{exp.startDate} - {exp.endDate}</p>
                  </div>
                </div>
                <p className="job-description-res">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {previewData.education && previewData.education.length > 0 && (
          <section className="resume-section-res">
            <h2 className="section-title-res">Education</h2>
            {previewData.education.map((edu, index) => (
              <div key={index} className="education-item-res">
                <div className="education-header-res">
                  <div>
                    <h3 className="degree-res">{edu.degree}</h3>
                    <p className="school-res">{edu.school}</p>
                  </div>
                  <div className="date-location-res">
                    <p>{edu.location}</p>
                    <p className="dates-res">{edu.graduationDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {previewData.skills && previewData.skills.length > 0 && (
          <section className="resume-section-res">
            <h2 className="section-title-res">Skills</h2>
            <div className="skills-grid-res">
              {previewData.skills.map((skill, index) => (
                <div key={index} className="skill-item-display-res">
                  <p className="skill-name-res">{skill.name}</p>
                  <p className="skill-level-res">{skill.level}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  const ResumePreview = ({ previewData, setIsEditing, handleDownload, resumeRef }) => (
    <div className="preview-container-res">
      <div className="preview-header-res">
        <h2>Resume Preview</h2>
        <div className="preview-actions-res">
          <button
            onClick={() => setIsEditing(true)}
            className="edit-btn-res"
          >
            <Edit2 className="btn-icon-res" />
            Edit Resume
          </button>
          <button
            onClick={handleDownload}
            className="download-btn-res"
          >
            <Download className="btn-icon-res" />
            Download PDF
          </button>
        </div>
      </div>
      
      <div ref={resumeRef} className="resume-display-res">
        <ModernTemplate previewData={previewData} />
      </div>
    </div>
  );

  if (isEditing) {
    return (
      <div className="resume-builder-res">
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
        <div className="floating-save-res">
          <button
            onClick={() => {
              const formData = collectFormData();
              setPreviewData(formData);
              setIsEditing(false);
              setCurrentStep('preview');
            }}
            className="floating-save-btn-res"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-builder-res">
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
        <ResumePreview
          previewData={previewData}
          setIsEditing={setIsEditing}
          handleDownload={handleDownload}
          resumeRef={resumeRef}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;