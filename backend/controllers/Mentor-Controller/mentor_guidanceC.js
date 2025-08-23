// routes/guidanceRoutes.js
const mentorGuidanceC = require('../../models/Student_model/guidance');
const express = require('express');
const router = express.Router();

// Get guidance by ID
const getGuidanceById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid guidance ID format' 
            });
        }

        const guidance = await mentorGuidanceC.findById(id);

        if (!guidance) {
            return res.status(404).json({ 
                message: 'Guidance not found' 
            });
        }

        res.status(200).json({ 
            message: 'Guidance retrieved successfully', 
            guidance 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching guidance', 
            error: error.message 
        });
    }
};

// Add new guidance
const addGuidance = async (req, res) => {
    try {
        const { 
            studentGName, 
            guidanceTitle, 
            guidanceDiscription, 
            status, 
            mentorName, 
            response 
        } = req.body;

        // Validation
        if (!guidanceTitle || !guidanceDiscription) {
            return res.status(400).json({
                message: 'Title and description are required'
            });
        }

        const newGuidance = new mentorGuidanceC({
            studentGName,
            guidanceTitle,
            guidanceDiscription,
            status: status || 'pending',
            mentorName: mentorName || 'Not Assigned',
            response: response || 'No response yet',
            guidanceDate: new Date(),
            responseDate: new Date()
        });

        const savedGuidance = await newGuidance.save();
        res.status(201).json({ 
            message: 'Guidance added successfully', 
            guidance: savedGuidance 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding guidance', 
            error: error.message 
        });
    }
};

// Get all guidances
const getAllGuidances = async (req, res) => {
    try {
        // Optional query parameters for filtering
        const { status, mentorName, limit = 50, skip = 0 } = req.query;
        
        let filter = {};
        
        // Add filters if provided
        if (status) filter.status = status;
        if (mentorName && mentorName !== 'Not Assigned') filter.mentorName = mentorName;

        const guidances = await mentorGuidanceC
            .find(filter)
            .sort({ guidanceDate: -1 }) // Sort by newest first
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const totalCount = await mentorGuidanceC.countDocuments(filter);

        res.status(200).json({ 
            guidances,
            totalCount,
            currentPage: Math.floor(skip / limit) + 1,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching guidances', 
            error: error.message 
        });
    }
};

// Update guidance (specifically for mentor responses)
const updateGuidance = async (req, res) => {
    try {
        const { id } = req.params;
        const { mentorName, response } = req.body;

        // Validate if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid guidance ID format' 
            });
        }

        // Validate required fields for response
        if (!mentorName || !response) {
            return res.status(400).json({ 
                message: 'Mentor name and response are required' 
            });
        }

        if (response.trim().length === 0) {
            return res.status(400).json({ 
                message: 'Response cannot be empty' 
            });
        }

        // Check if guidance exists and is still pending
        const existingGuidance = await mentorGuidanceC.findById(id);
        if (!existingGuidance) {
            return res.status(404).json({ 
                message: 'Guidance not found' 
            });
        }

        // Prepare update object - when response is provided, automatically set status to answered
        const updateData = {
            mentorName: mentorName.trim(),
            response: response.trim(),
            status: 'answered', // Automatically set to answered when response is provided
            responseDate: new Date()
        };

        const updatedGuidance = await mentorGuidanceC.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({ 
            message: 'Response submitted successfully', 
            guidance: updatedGuidance 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating guidance', 
            error: error.message 
        });
    }
};

// Assign mentor to guidance (without response)
const assignMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const { mentorName } = req.body;

        // Validate if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid guidance ID format' 
            });
        }

        if (!mentorName || mentorName.trim().length === 0) {
            return res.status(400).json({ 
                message: 'Mentor name is required' 
            });
        }

        const updatedGuidance = await mentorGuidanceC.findByIdAndUpdate(
            id,
            { 
                mentorName: mentorName.trim(),
                responseDate: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedGuidance) {
            return res.status(404).json({ 
                message: 'Guidance not found' 
            });
        }

        res.status(200).json({ 
            message: 'Mentor assigned successfully', 
            guidance: updatedGuidance 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error assigning mentor', 
            error: error.message 
        });
    }
};

// Delete guidance
const deleteGuidance = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid guidance ID format' 
            });
        }

        const deletedGuidance = await mentorGuidanceC.findByIdAndDelete(id);

        if (!deletedGuidance) {
            return res.status(404).json({ 
                message: 'Guidance not found' 
            });
        }

        res.status(200).json({ 
            message: 'Guidance deleted successfully',
            guidance: deletedGuidance
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting guidance', 
            error: error.message 
        });
    }
};

// Get guidance statistics
const getGuidanceStats = async (req, res) => {
    try {
        const totalGuidances = await mentorGuidanceC.countDocuments();
        const pendingGuidances = await mentorGuidanceC.countDocuments({ status: 'pending' });
        const answeredGuidances = await mentorGuidanceC.countDocuments({ status: 'answered' });
        
        // Get guidances by mentor
        const guidancesByMentor = await mentorGuidanceC.aggregate([
            {
                $group: {
                    _id: '$mentorName',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            stats: {
                total: totalGuidances,
                pending: pendingGuidances,
                answered: answeredGuidances,
                byMentor: guidancesByMentor
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching guidance statistics', 
            error: error.message 
        });
    }
};



module.exports = {
    
    addGuidance,
    getAllGuidances,
    getGuidanceById,
    updateGuidance,
    assignMentor,
    deleteGuidance,
    getGuidanceStats
};