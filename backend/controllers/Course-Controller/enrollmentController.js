const Enrollment = require('../../models/Course_model/Enrollment');

const createEnrollment = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    const enrollment = new Enrollment({ courseId, userId });
    const saved = await enrollment.save();
    return res.status(201).json({ message: 'Enrolled', data: saved });
  } catch (err) {
    console.error('createEnrollment error', err);
    return res.status(500).json({ message: err.message });
  }
};

const listEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ enrolledAt: -1 });
    return res.status(200).json(enrollments);
  } catch (err) {
    console.error('listEnrollments error', err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createEnrollment, listEnrollments };
