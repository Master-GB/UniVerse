const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const MentornshipAnnouncement = require('../../models/Mentor_model/MentornshipAnnounsment');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/mentorship-announcements/';
        try {
            // Create directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log('📁 Created upload directory:', uploadDir);
            }
            cb(null, uploadDir);
        } catch (error) {
            console.error('❌ Error creating upload directory:', error);
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        try {
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
            console.log('📝 Generated filename:', filename);
            cb(null, filename);
        } catch (error) {
            console.error('❌ Error generating filename:', error);
            cb(error, null);
        }
    }
});

const fileFilter = (req, file, cb) => {
    console.log('🔍 Checking file:', file.originalname, 'Type:', file.mimetype);
    
    // Allow images and videos
    const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'video/mp4', 'video/webm', 'video/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        console.log('✅ File type accepted:', file.mimetype);
        cb(null, true);
    } else {
        console.log('❌ File type rejected:', file.mimetype);
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const addMentorshipAnnouncement = async (req, res) => {
    console.log('🚀 Starting addMentorshipAnnouncement...');
    console.log('📥 Request body:', req.body);
    console.log('📎 Files received:', req.files ? req.files.length : 0);
    
    try {
        const {
            anc_create_mentor_name,
            anc_title,
            anc_description,
            anc_link,
            announcement_type
        } = req.body;

        console.log('📋 Extracted data:', {
            anc_create_mentor_name,
            anc_title,
            anc_description,
            anc_link,
            announcement_type
        });

        // Validate required fields
        if (!anc_create_mentor_name) {
            throw new Error('Mentor name is required');
        }
        if (!anc_title) {
            throw new Error('Title is required');
        }
        if (!anc_description) {
            throw new Error('Description is required');
        }

        // Process uploaded files
        let anc_resources = [];
        if (req.files && req.files.length > 0) {
            console.log('📁 Processing files...');
            anc_resources = req.files.map(file => {
                console.log('📄 Processing file:', file.originalname);
                return {
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    path: file.path
                };
            });
            console.log('✅ Files processed:', anc_resources.length);
        } else {
            console.log('ℹ️ No files to process');
        }

        const announcementData = {
            anc_create_mentor_name,
            anc_create_date: new Date(),
            anc_create_time: new Date().toLocaleTimeString("en-GB"),
            anc_title,
            anc_description,
            anc_link: anc_link || '',
            anc_resources
        };

        console.log('💾 Creating announcement with data:', announcementData);

        const newAnnouncement = new MentornshipAnnouncement(announcementData);
        
        console.log('🔄 Saving to database...');
        const savedAnnouncement = await newAnnouncement.save();
        
        console.log('✅ Announcement saved successfully:', savedAnnouncement._id);
        
        res.status(201).json({
            message: "Mentorship announcement added successfully",
            data: savedAnnouncement
        });

    } catch (error) {
        console.error("❌ Error in addMentorshipAnnouncement:", error);
        console.error("❌ Error stack:", error.stack);
        
        // Clean up uploaded files if database save fails
        if (req.files && req.files.length > 0) {
            console.log('🧹 Cleaning up uploaded files due to error...');
            req.files.forEach(file => {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log('🗑️ Deleted file:', file.path);
                    }
                } catch (cleanupError) {
                    console.error('❌ Error cleaning up file:', cleanupError);
                }
            });
        }
        
        res.status(500).json({
            message: "Error adding mentorship announcement",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const updateMentorshipAnnounsment = async (req, res) => {
    const {id} = req.params;
    console.log('🔄 Updating announcement:', id);
    console.log('📥 Update data:', req.body);
    
    const {
        anc_create_mentor_name,
        anc_title,
        anc_description,
        anc_link,
        announcement_type
    } = req.body;

    try {
        // Process new uploaded files if any
        let newResources = [];
        if (req.files && req.files.length > 0) {
            console.log('📁 Processing new files for update...');
            newResources = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path
            }));
        }

        // Get existing announcement to preserve old resources
        const existingAnnouncement = await MentornshipAnnouncement.findById(id);
        if (!existingAnnouncement) {
            return res.status(404).json({ message: "Mentorship Announcement not found" });
        }

        // Combine existing resources with new ones
        const updatedResources = [...existingAnnouncement.anc_resources, ...newResources];

        const updateAnnounsment = await MentornshipAnnouncement.findByIdAndUpdate(id, {
            anc_create_mentor_name,
            anc_title,
            anc_description,
            anc_link,
            anc_resources: updatedResources
        }, { new: true });

        if (!updateAnnounsment){
            return res.status(404).json({message: "Mentorship Announcement not found"})
        }

        console.log('✅ Announcement updated successfully');
        res.status(200).json({
            message: "Mentorship Announcement updated successfully",
            data: updateAnnounsment
        });
    }catch (error) {
        console.error("❌ Error updating announcement:", error);
        res.status(500).json({
            message: "Error updating Announcement",
            error: error.message
        });
    }
};

const deleteMentornshipAnnounsment = async (req,res)=>{
    const { id } = req.params;
    console.log('🗑️ Deleting announcement:', id);

    try{
        const deletedAnounsment = await MentornshipAnnouncement.findByIdAndDelete(id);
        if (!deletedAnounsment){
            return res.status(404).json({message: "Mentorship Announcement not found"})
        }

        // Delete associated files
        if (deletedAnounsment.anc_resources && deletedAnounsment.anc_resources.length > 0) {
            console.log('🧹 Cleaning up associated files...');
            deletedAnounsment.anc_resources.forEach(resource => {
                try {
                    if (fs.existsSync(resource.path)) {
                        fs.unlinkSync(resource.path);
                        console.log('🗑️ Deleted file:', resource.path);
                    }
                } catch (fileError) {
                    console.error('❌ Error deleting file:', fileError);
                }
            });
        }

        console.log('✅ Announcement deleted successfully');
        res.status(200).json({
            message: "Mentorship Announcement deleted successfully"});
    }catch(error){
        console.error("❌ Error deleting announcement:", error);
        res.status(500).json({
            message: "Error deleting Announcement",
            error: error.message
        });
    }
};

const getMentornshipAnnounsment = async (req,res)=>{
    console.log('📋 Fetching all announcements...');
    
    try{
        const announcements = await MentornshipAnnouncement.find().sort({ anc_create_date: -1 });
        console.log('✅ Found announcements:', announcements.length);
        
        res.status(200).json({
            message: "Mentorship Announcements retrieved successfully",
            data: announcements
        });
    }catch (error){
        console.error("❌ Error fetching announcements:", error);
        res.status(500).json({
            message: "Error retrieving Announcements",
            error: error.message
        });
    }
}

const getMentornshipAnnounsmentById = async (req,res)=>{
    const { id } = req.params;
    console.log('📋 Fetching announcement by ID:', id);

    try{
        const announcement = await MentornshipAnnouncement.findById(id);
        if (!announcement){
            return res.status(404).json({message: "Mentorship Announcement not found"});
        }
        
        console.log('✅ Announcement found');
        res.status(200).json({
            message: "Mentorship Announcement retrieved successfully",
            data: announcement
        });
    }catch (error){
        console.error("❌ Error fetching announcement:", error);
        res.status(500).json({
            message: "Error retrieving Announcement",
            error: error.message
        });
    }
}

module.exports = {
    addMentorshipAnnouncement,
    updateMentorshipAnnounsment,
    deleteMentornshipAnnounsment,
    getMentornshipAnnounsment,
    getMentornshipAnnounsmentById,
    upload
};