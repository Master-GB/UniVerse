// controllers/Student-Controller/ResumeBuilderC.js
const Resume = require('../../models/Student_model/ResumeBuilder'); // Adjust path as needed

// Create Resume
const createResume = async (req, res) => {
    try {
        console.log('Received data:', req.body);

        // Validate required fields
        const { template, personalInfo } = req.body;
        
        if (!template) {
            return res.status(400).json({
                success: false,
                message: 'Template selection is required'
            });
        }

        if (!personalInfo || !personalInfo.fullName || !personalInfo.email || !personalInfo.phone) {
            return res.status(400).json({
                success: false,
                message: 'Personal information (Full Name, Email, Phone) is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(personalInfo.email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create resume data object
        const resumeData = {
            studentId: req.user?.id || req.body.studentId, // Get from auth or request body
            template: template,
            personalInfo: {
                fullName: personalInfo.fullName.trim(),
                email: personalInfo.email.trim().toLowerCase(),
                phone: personalInfo.phone.trim(),
                address: personalInfo.address?.trim() || '',
                linkedin: personalInfo.linkedin?.trim() || '',
                website: personalInfo.website?.trim() || ''
            },
            summary: req.body.summary?.trim() || '',
            experience: req.body.experience || [],
            education: req.body.education || [],
            skills: req.body.skills || [],
            projects: req.body.projects || [],
            certifications: req.body.certifications || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database
        const resume = new Resume(resumeData);
        const savedResume = await resume.save();

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: savedResume
        });

    } catch (error) {
        console.error('Error creating resume:', error);
        
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({
                success: false,
                message: 'A resume with this information already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while creating resume',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};

// Get Resume by Student ID
const getResumeByStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        
        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        const resume = await Resume.findOne({ studentId: studentId });
        
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found for this student'
            });
        }

        res.status(200).json({
            success: true,
            data: resume
        });

    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching resume',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};

// Update Resume by Resume ID
const updateResume = async (req, res) => {
    try {
        const resumeId = req.params.id;
        
        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: 'Resume ID is required'
            });
        }

        // Validate required fields if they exist in the update
        if (req.body.personalInfo) {
            const { personalInfo } = req.body;
            if (personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email address'
                });
            }
        }

        // Prepare update data
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedResume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: updatedResume
        });

    } catch (error) {
        console.error('Error updating resume:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while updating resume',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};

const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find();
        res.status(200).json({
            success: true,
            data: resumes
        });
    }
    catch (error) {
        console.error('Error fetching all resumes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching resumes',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};


module.exports = {
    createResume,
    getResumeByStudent,
    updateResume,
    getAllResumes
};