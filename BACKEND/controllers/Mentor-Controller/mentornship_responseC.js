const mentorshipResponseController = require('../../models/Mentor_model/mentornship_response');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
    cb(null, true); // Accept all files
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const addMentorshipResponse = async (req, res) => {
  try {
    const {
      mentor_name,
      mentor_description,
      mentor_email,
      session_start_date,
      session_start_time,
      session_create_date,
      session_create_time,
      seat_count,
      session_duration,
      session_title,
      session_status,
      session_description,
      session_link,
      resource_links
    } = req.body;

    let session_resources = [];
    if (req.files && req.files.session_resources && req.files.session_resources.length > 0) {
      session_resources = req.files.session_resources.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }));
    }

    const newResponse = new mentorshipResponseController({
      mentor_name,
      mentor_description,
      mentor_email,
      session_start_date,
      session_start_time,
      session_create_date,
      session_create_time,
      seat_count,
      session_duration,
      session_title,
      session_status,
      session_description,
      session_link,
      resource_links: Array.isArray(resource_links) ? resource_links : resource_links ? [resource_links] : [],
      session_resources
    });

    await newResponse.save();
    res.status(201).json({
      message: "Mentorship response added successfully",
      data: newResponse
    });

  } catch (error) {
    console.error("❌ Error adding mentorship response:", error);
    res.status(500).json({
      message: "Error adding mentorship response",
      error: error.message
    });
  }
};

const updateMentorshipResponse = async (req, res) => {
    const { id } = req.params;
    const {
        mentor_name,
        mentor_description,
        mentor_email,
        session_start_date,
        session_start_time,
        session_create_date,
        session_create_time,
        session_title,
        session_duration,
        seat_count,
        session_status,
        session_description,
        session_link,
        session_resources
    } = req.body;

    try {
        const updatedResponse = await mentorshipResponseController.findByIdAndUpdate(id, {
            mentor_name,
            mentor_description,
            mentor_email,
            session_start_date,
            session_start_time,
            session_create_date,
            session_create_time,
            session_title,
            session_duration,
            seat_count,
            session_status,
            session_description,
            session_link,
            session_resources
        }, { new: true });

        if (!updatedResponse) {
            return res.status(404).json({ message: "Mentorship response not found" });
        }

        res.status(200).json({ 
            message: "Mentorship response updated successfully", 
            data: updatedResponse 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating mentorship response", 
            error: error.message 
        });
    }
}

const deleteMentorshipResponse = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedResponse = await mentorshipResponseController.findByIdAndDelete(id);

        if (!deletedResponse) {
            return res.status(404).json({ message: "Mentorship response not found" });
        }

        res.status(200).json({ message: "Mentorship response deleted successfully" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting mentorship response", 
            error: error.message 
        });
    }
}

const getMentorshipResponse = async (req, res) => {
    try {
        const responses = await mentorshipResponseController.find();
        // Return the data array directly so frontend can access it
        res.status(200).json(responses);
    } catch (error) {
        console.error("Error retrieving mentorship responses:", error);
        res.status(500).json({ 
            message: "Error retrieving mentorship responses", 
            error: error.message 
        });
    }
}


const getMentorshipResponseById = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await mentorshipResponseController.findById(id);

        if (!response) {
            return res.status(404).json({ message: "Mentorship response not found" });
        }

        // Return the response directly
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving mentorship response:", error);
        res.status(500).json({ 
            message: "Error retrieving mentorship response", 
            error: error.message 
        });
    }
}

module.exports = {
    getMentorshipResponse, 
    deleteMentorshipResponse, 
    updateMentorshipResponse,
    addMentorshipResponse,
    getMentorshipResponseById,
    upload
};