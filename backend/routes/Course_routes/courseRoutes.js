const express =require('express');
const multer = require('multer');
const path = require('path');

// multer setup for file uploads to BACKEND/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
    
} = require('../../controllers/Course-Controller/courseCreateC');


console.log('Course routes loaded');


router.get('/display', getCourses);
router.get('/getid/:id/', getCourseById);
router.post('/add', upload.single('image'), createCourse);
router.put('/update/:id', upload.single('image'), updateCourse);
router.delete('/delete/:id', deleteCourse);

// Aliases matching frontend expectations
router.get('/getAll', getCourses);
router.post('/create', upload.single('image'), createCourse);

// RESTful endpoints (used by frontend and other clients)
router.get('/', (req, res, next) => {
    console.log(new Date().toISOString(), 'Course GET / called');
    next();
}, getCourses);
router.get('/:id', getCourseById);
router.post('/', upload.single('image'), createCourse);
router.put('/:id', upload.single('image'), updateCourse);
router.delete('/:id', deleteCourse);



module.exports = router;
