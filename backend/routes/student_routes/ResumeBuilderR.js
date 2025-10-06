// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const {
    createResume,
    getResumeByStudent,
    getAllResumes,
    updateResume
} = require('../../controllers/Student-Controller/ResumeBuilderC');

// Create Resume
router.post('/create',createResume);

// Get Resume by Student ID
router.get('/:id',getResumeByStudent);

// Update Resume by Resume ID
router.put('/:id',updateResume);

router.get('/display', getAllResumes);

module.exports = router;
