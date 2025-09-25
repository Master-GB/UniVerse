const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true,
    enum: ['template1', 'template2', 'template3'],
    default: 'template1'
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    gpa: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  experience: [{
    position: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    responsibilities: [{
      type: String,
      trim: true
    }]
  }],
  skills: [{
    type: String,
    required: true
  }],
  projects: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    technologies: [{
      type: String,
      trim: true
    }],
    projectUrl: {
      type: String,
      trim: true
    }
  }],
  languages: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'],
      required: true
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});


const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;