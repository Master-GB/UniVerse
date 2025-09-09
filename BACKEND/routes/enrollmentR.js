const express = require('express');
const router = express.Router();
const { createEnrollment, listEnrollments } = require('../controllers/enrollmentController');

router.post('/', createEnrollment);
router.get('/', listEnrollments);

module.exports = router;
