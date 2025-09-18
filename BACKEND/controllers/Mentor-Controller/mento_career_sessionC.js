const mentorshipResponseController = require('../../models/Mentor_model/mentor_career_session');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    cb(null, true); // Accept all files
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const addCareerSession = async (req, res) => {
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
        buffer: file.buffer // <-- store buffer
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

const UpdateCareerSession = async (req, res) => {
    const { id } = req.params;
    console.log('🚀 Update request for ID:', id);
    console.log('📦 Raw request body:', JSON.stringify(req.body, null, 2));
    console.log('📝 Request headers:', req.headers);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('❌ Invalid ID format:', id);
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        // 1. First verify the document exists
        const existingDoc = await mentorshipResponseController.findById(id);
        if (!existingDoc) {
            console.error('❌ Document not found for ID:', id);
            return res.status(404).json({ message: "Mentorship response not found" });
        }

        // 2. Prepare update data
        const updateData = { ...req.body };
        
        // 3. Handle special fields
        if (updateData.session_resources && typeof updateData.session_resources === 'string') {
            try {
                updateData.session_resources = JSON.parse(updateData.session_resources);
            } catch (e) {
                console.error('Failed to parse session_resources:', e);
                return res.status(400).json({ message: "Invalid session_resources format" });
            }
        }

        // 4. Convert seat_count to number if provided
        if (updateData.seat_count !== undefined) {
            const seatCount = Number(updateData.seat_count);
            if (isNaN(seatCount)) {
                console.error('Invalid seat_count:', updateData.seat_count);
                return res.status(400).json({ message: "seat_count must be a number" });
            }
            updateData.seat_count = seatCount;
        }

        // 5. Only update allowed fields
        const allowedFields = [
            'mentor_name', 'mentor_description', 'mentor_email',
            'session_start_date', 'session_start_time', 'session_create_date', 'session_create_time',
            'session_title', 'session_duration', 'session_description', 'session_link',
            'seat_count', 'session_status', 'session_resources'
        ];
        
        const filteredUpdate = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredUpdate[key] = updateData[key];
            }
        });

        console.log('📤 Final update data:', filteredUpdate);

        // 6. Perform the update
        const updatedDoc = await mentorshipResponseController.findByIdAndUpdate(
            id,
            { $set: filteredUpdate },
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            throw new Error('Update operation returned null');
        }

        console.log('✅ Update successful');
        res.status(200).json({ 
            success: true,
            message: "Mentorship response updated successfully", 
            data: updatedDoc 
        });
    } catch (error) {
        console.error('Error updating mentorship response:', error);
        res.status(500).json({ 
            message: "Error updating mentorship response", 
            error: error.message 
        });
    }
}

const deleteCareerSession = async (req, res) => {
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

const getCareerSession = async (req, res) => {
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


const getCareerSessionById = async (req, res) => {
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


const getArticleImage = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await MentornshipAnnouncement.findById(id);

    if (!article || !article.article_image || !article.article_image.data) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', article.article_image.contentType);
    res.send(article.article_image.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
};


const bookCareerSession = async (req, res) => {
    try {
        const { sessionId, studentId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        // Find the session
        const session = await mentorshipResponseController.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if session is available
        if (session.session_status !== 'book') {
            return res.status(400).json({ message: "Session is not available for booking" });
        }

        // Update session status to 'booked'
        const updatedSession = await mentorshipResponseController.findByIdAndUpdate(
            sessionId,
            { $set: { session_status: 'booked' } },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            return res.status(500).json({ message: "Failed to update session status" });
        }

        res.status(200).json({
            success: true,
            message: "Session booked successfully",
            data: updatedSession
        });

    } catch (error) {
        console.error('Error booking session:', error);
        res.status(500).json({
            message: "Error booking session",
            error: error.message
        });
    }
};

const cancelCareerSession = async (req, res) => {
    try {
        const { sessionId, studentId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        // Find the session
        const session = await mentorshipResponseController.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if session is booked
        if (session.session_status !== 'booked') {
            return res.status(400).json({ message: "Session is not booked" });
        }

        // Update session status back to 'book'
        const updatedSession = await mentorshipResponseController.findByIdAndUpdate(
            sessionId,
            { $set: { session_status: 'book' } },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            return res.status(500).json({ message: "Failed to update session status" });
        }

        res.status(200).json({
            success: true,
            message: "Booking canceled successfully",
            data: updatedSession
        });

    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({
            message: "Error canceling booking",
            error: error.message
        });
    }
};

// Don't forget to export these new functions
module.exports = {
    addCareerSession, 
    UpdateCareerSession, 
    deleteCareerSession,
    getCareerSession,
    getCareerSessionById,
    getArticleImage,
    bookCareerSession,    // Add this
    cancelCareerSession,  // Add this
    upload
};

