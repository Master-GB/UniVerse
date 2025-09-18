const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
    upload,
    addArticle,
    getAllArticles,
    deleteArticle,
    updateArticle,
    getArticleById,
    getArticleImage
  
} = require('../../controllers/Mentor-Controller/mentor_articleC');


router.get('/display', getAllArticles);
router.get('/getid/:id', getArticleById);
router.post('/add', upload.single('article_image'),addArticle);
router.put('/update/:id',upload.single('article_image'),updateArticle);
router.delete('/delete/:id', deleteArticle);
router.get('/image/:id', getArticleImage);
module.exports = router;