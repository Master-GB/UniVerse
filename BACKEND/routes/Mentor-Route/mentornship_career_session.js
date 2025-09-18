const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
    addCareerSession, 
    UpdateCareerSession, 
    deleteCareerSession,
    getCareerSession,
    getCareerSessionById,
    getArticleImage,
    bookCareerSession,  
    cancelCareerSession, 
    upload
} = require('../../controllers/Mentor-Controller/mento_career_sessionC');

router.get('/display', getCareerSession);
router.get('/getid/:id', getCareerSessionById);
router.post('/add', upload.single('article_image'),addCareerSession);
router.put('/update/:id',upload.single('article_image'),UpdateCareerSession);
router.delete('/delete/:id', deleteCareerSession);
router.get('/image/:id', getArticleImage);
router.post('/book', bookCareerSession);     
router.post('/cancel', cancelCareerSession); 

module.exports = router;