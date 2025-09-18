const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
  addMentorshipAnnouncement,
    updateMentorshipAnnounsment,
    deleteMentornshipAnnounsment,
    getMentornshipAnnounsment,  
    getMentornshipAnnounsmentById,
    upload
} = require('../../controllers/Mentor-Controller/Mentornship_AnnounsmentC');


router.get('/display', getMentornshipAnnounsment);
router.get('/getid/:id', getMentornshipAnnounsmentById);
router.post('/add', upload.array('resources', 10), addMentorshipAnnouncement);
router.put('/update/:id', upload.array('resources', 10), updateMentorshipAnnounsment);
router.delete('/delete/:id', deleteMentornshipAnnounsment);
module.exports = router;