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

router.put('/update/:id', upload.single('session_resources'), updateMentorshipResponse);

router.delete('/delete/:id', deleteMentorshipResponse);

module.exports = router;