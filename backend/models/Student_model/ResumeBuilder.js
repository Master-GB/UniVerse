// models/Resume.js
const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    linkedin: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    }
});

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    startDate: {
        type: String,
        trim: true
    },
    endDate: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
});

const educationSchema = new mongoose.Schema({
    degree: {
        type: String,
        trim: true,
        maxlength: [100, 'Degree cannot exceed 100 characters']
    },
    school: {
        type: String,
        trim: true,
        maxlength: [100, 'School name cannot exceed 100 characters']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    graduationDate: {
        type: String,
        trim: true
    },
    gpa: {
        type: String,
        trim: true
    }
});

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        maxlength: [50, 'Skill name cannot exceed 50 characters']
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
    }
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Project description cannot exceed 500 characters']
    },
    technologies: [{
        type: String,
        trim: true
    }],
    url: {
        type: String,
        trim: true
    },
    startDate: {
        type: String,
        trim: true
    },
    endDate: {
        type: String,
        trim: true
    }
});

const certificationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Certification name cannot exceed 100 characters']
    },
    issuer: {
        type: String,
        trim: true,
        maxlength: [100, 'Issuer name cannot exceed 100 characters']
    },
    date: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        trim: true
    }
});

const resumeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    template: {
        type: String,
        required: [true, 'Template selection is required'],
        enum: ['modern', 'classic', 'creative', 'minimal']
    },
    personalInfo: {
        type: personalInfoSchema,
        required: [true, 'Personal information is required']
    },
    summary: {
        type: String,
        trim: true,
        maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
resumeSchema.index({ studentId: 1 });
resumeSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
resumeSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Pre-update middleware to update updatedAt
resumeSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

// Virtual for resume URL (if needed)
resumeSchema.virtual('resumeUrl').get(function() {
    return `/api/resumes/${this._id}`;
});

// Method to get formatted experience dates
resumeSchema.methods.getFormattedExperience = function() {
    return this.experience.map(exp => ({
        ...exp.toObject(),
        formattedDuration: `${exp.startDate} - ${exp.endDate || 'Present'}`
    }));
};

// Method to get formatted education dates
resumeSchema.methods.getFormattedEducation = function() {
    return this.education.map(edu => ({
        ...edu.toObject(),
        formattedGraduation: edu.graduationDate || 'In Progress'
    }));
};

// Static method to find resumes by student
resumeSchema.statics.findByStudent = function(studentId) {
    return this.find({ studentId, isActive: true }).sort({ updatedAt: -1 });
};

// Static method to get resume statistics
resumeSchema.statics.getStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$template',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
};

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;