const mentorshipResponseController = require('../../models/Mentor_model/mentornship_response');
const express = require('express');

const addMentorshipResponse = async (req, res) => {
    const {
        mentor_name,
        mentor_description,
        mentor_email,
        session_create_date,
        session_create_time,
        session_title,
        session_description,
        session_link,
        session_resources
    } = req.body;

    try {
        const newResponse = new mentorshipResponseController({
            mentor_name,
            mentor_description,
            mentor_email,
            session_create_date,
            session_create_time,
            session_title,
            session_description,
            session_link,
            session_resources
        });

        await newResponse.save();
        res.status(201).json({ message: "Mentorship response added successfully", data: newResponse });
    } catch (error) {
        res.status(500).json({ message: "Error adding mentorship response", error: error.message });
    }
}

const updateMentorshipResponse = async (req, res) => {
    const { id } = req.params;
    const {
        mentor_name,
        mentor_description,
        mentor_email,
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

        res.status(200).json({ message: "Mentorship response updated successfully", data: updatedResponse });
    } catch (error) {
        res.status(500).json({ message: "Error updating mentorship response", error: error.message });
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
        res.status(500).json({ message: "Error deleting mentorship response", error: error.message });
    }
}

const getMentorshipResponse = async (req, res) => {
    try {
        const responses = await mentorshipResponseController.find();
        res.status(200).json({ message: "Mentorship responses retrieved successfully", data: responses });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving mentorship responses", error: error.message });
    }
}

const getMentorshipResponseById = async (req, res) => {
    const { id } = req.params;



    try {
        const response = await mentorshipResponseController.findById(id);

        if (!response) {
            return res.status(404).json({ message: "Mentorship response not found" });
        }

        res.status(200).json({ message: "Mentorship response retrieved successfully", response});
    } catch (error) {
        res.status(500).json({ message: "Error retrieving mentorship response", error: error.message });
    }
}

module.exports = {
    getMentorshipResponse, 
    deleteMentorshipResponse, 
    updateMentorshipResponse,
    addMentorshipResponse,
    getMentorshipResponseById
};