const express =require('express');

const router = express.Router();
const {
    addMentorshipResponse,
    updateMentorshipResponse,
    deleteMentorshipResponse,
    getMentorshipResponse,
} = require('../../controllers/Mentor-Controller/mentornship_responseC');

router.get('/', getMentorshipResponse);
router.get(':id/', getMentorshipResponse);

router.post('/', addMentorshipResponse);

router.put('/:id', updateMentorshipResponse);

router.delete('/:id', deleteMentorshipResponse);

module.exports = router;