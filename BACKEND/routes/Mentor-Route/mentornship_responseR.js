const express =require('express');

const router = express.Router();
const {
    addMentorshipResponse,
    updateMentorshipResponse,
    deleteMentorshipResponse,
    getMentorshipResponse,
    getMentorshipResponseById
} = require('../../controllers/Mentor-Controller/mentornship_responseC');

router.get('/display', getMentorshipResponse);
router.get('/getid/:id/', getMentorshipResponseById);

router.post('/add', addMentorshipResponse);

router.put('/update/:id', updateMentorshipResponse);

router.delete('/delete/:id', deleteMentorshipResponse);

module.exports = router;