const mentorshipResponseController = require('../../models/Mentor_model/mentornship_response');
const express = require('express');

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
      session_title,
      session_description,
      session_link
    } = req.body;

    // if file uploaded, multer puts it in req.file
    const session_resources = req.file ? req.file.filename : null;

    const newResponse = new mentorshipResponseController({
      mentor_name,
      mentor_description,
      mentor_email,
      session_start_date,
      session_start_time,
      session_create_date,
      session_create_time,
      session_title,
      session_description,
      session_link,
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

// ✅ Fixed: Return the data directly, not wrapped in another object
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

// ✅ Fixed: Return the data directly
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
    getMentorshipResponseById
};