const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
  addMentorshipResponse,
  updateMentorshipResponse,
  deleteMentorshipResponse,
  getMentorshipResponse,
  getMentorshipResponseById,
  upload // <-- import upload here
} = require('../../controllers/Mentor-Controller/mentornship_responseC');

// Make sure uploads folder exists and files are stored correctly
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ Fixed Routes - Don't call controller functions here, let them handle the response
router.get('/display', getMentorshipResponse);

router.get('/getid/:id', getMentorshipResponseById);

router.post('/add', upload.fields([{ name: 'session_resources', maxCount: 10 }]), addMentorshipResponse);

router.put('/update/:id', updateMentorshipResponse);

// Test route to verify update functionality
router.put('/test-update/:id', async (req, res) => {
  try {
    console.log('🔍 Test update - Request body:', req.body);
    console.log('🔍 Test update - Headers:', req.headers);
    
    // Simple update that should always work
    const result = await mentorshipResponseController.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          session_status: 'test',
          seat_count: 999,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Test update successful',
      data: result 
    });
  } catch (error) {
    console.error('Test update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test update failed',
      error: error.message 
    });
  }
});

router.delete('/delete/:id', deleteMentorshipResponse);

module.exports = router;