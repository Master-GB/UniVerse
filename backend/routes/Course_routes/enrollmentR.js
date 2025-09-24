const express = require('express');
const router = express.Router();
const { createEnrollment, listEnrollments } = require('../../controllers/Course-Controller/enrollmentController');

router.post('/', createEnrollment);
router.get('/', listEnrollments);

module.exports = router;
