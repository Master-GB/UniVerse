const PastPaper = require('../../models/passpaper_model/PasspaperModel');

// @desc    Get all past papers with filtering
// @route   GET /pastpapers
// @access  Public
const getPastPapers = async (req, res, next) => {
  try {
    const {
      year,
      semester,
      subject,
      examType,
      hasAnswers,
      searchQuery,
      page = 1,
      limit = 10,
      sortBy = 'year',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (year && year !== 'all') {
      filter.year = parseInt(year);
    }

    if (semester && semester !== 'all') {
      filter.semester = semester;
    }

    if (subject && subject !== 'all') {
      filter.$or = [
        { code: { $regex: subject, $options: 'i' } },
        { title: { $regex: subject, $options: 'i' } }
      ];
    }

    if (examType && examType !== 'all') {
      filter.tags = { $in: [examType] };
    }

    if (hasAnswers === 'true') {
      filter.modelAnswers = true;
    }

    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const papers = await PastPaper.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('uploadedBy', 'name email')
      .select('-__v');

    const total = await PastPaper.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: papers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: papers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single past paper by ID
// @route   GET /pastpapers/:id
// @access  Public
const getPastPaperById = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Past paper not found'
      });
    }

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new past paper
// @route   POST /pastpapers
// @access  Private (Admin/Staff)
const createPastPaper = async (req, res, next) => {
  try {
    const {
      title,
      code,
      year,
      semester,
      questions,
      timeAllowed,
      fileUrl,
      modelAnswersUrl,
      modelAnswers,
      difficulty,
      tags,
      department
    } = req.body;

    // Validate required fields
    if (!title || !code || !year || !semester || !questions || !timeAllowed || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create paper WITHOUT uploadedBy
    const paper = await PastPaper.create({
      title,
      code,
      year,
      semester,
      questions,
      timeAllowed,
      fileUrl,
      modelAnswersUrl,
      modelAnswers: modelAnswers || !!modelAnswersUrl,
      difficulty: difficulty || 'Medium',
      tags: tags || [],
      department
      // Remove uploadedBy field entirely
    });

    res.status(201).json({
      success: true,
      data: paper
    });
  } catch (error) {
    console.error('Create paper error:', error); // Add this for debugging
    next(error);
  }
};

// @desc    Update past paper
// @route   PUT /pastpapers/:id
// @access  Private (Admin/Staff)
const updatePastPaper = async (req, res, next) => {
  try {
    let paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Past paper not found'
      });
    }

    // Check if user is authorized (paper uploader or admin)
    if (paper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this paper'
      });
    }

    // Update modelAnswers flag if modelAnswersUrl is provided
    if (req.body.modelAnswersUrl) {
      req.body.modelAnswers = true;
    }

    paper = await PastPaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete past paper
// @route   DELETE /pastpapers/:id
// @access  Private (Admin)
const deletePastPaper = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Past paper not found'
      });
    }

    // Soft delete - set isActive to false
    paper.isActive = false;
    await paper.save();

    res.status(200).json({
      success: true,
      message: 'Past paper deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download past paper (increments download count)
// @route   GET /pastpapers/:id/download
// @access  Public
const downloadPastPaper = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Past paper not found'
      });
    }

    // Increment download count
    await paper.incrementDownload();

    res.status(200).json({
      success: true,
      data: {
        fileUrl: paper.fileUrl,
        modelAnswersUrl: paper.modelAnswersUrl,
        downloadCount: paper.downloadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter options (years, semesters, subjects)
// @route   GET /pastpapers/filters/options
// @access  Public
const getFilterOptions = async (req, res, next) => {
  try {
    const years = await PastPaper.distinct('year', { isActive: true });
    const semesters = await PastPaper.distinct('semester', { isActive: true });
    const codes = await PastPaper.distinct('code', { isActive: true });
    const tags = await PastPaper.distinct('tags', { isActive: true });

    // Get subjects with their codes
    const subjects = await PastPaper.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$code',
          title: { $first: '$title' }
        }
      },
      {
        $project: {
          _id: 0,
          code: '$_id',
          name: {
            $arrayElemAt: [{ $split: ['$title', ' - '] }, 0]
          }
        }
      },
      { $sort: { code: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        years: years.sort((a, b) => b - a),
        semesters,
        subjects,
        examTypes: tags.filter(tag => ['Midterm', 'Final Exam'].includes(tag))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get past papers statistics
// @route   GET /pastpapers/admin/stats
// @access  Private (Admin)
const getPaperStatistics = async (req, res, next) => {
  try {
    const stats = await PastPaper.getStatistics();

    // Papers by year
    const papersByYear = await PastPaper.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Papers by subject
    const papersBySubject = await PastPaper.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$code',
          count: { $sum: 1 },
          title: { $first: '$title' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most downloaded papers
    const mostDownloaded = await PastPaper.find({ isActive: true })
      .sort({ downloadCount: -1 })
      .limit(10)
      .select('title code year downloadCount');

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        papersByYear,
        papersBySubject,
        mostDownloaded
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPastPapers,
  getPastPaperById,
  createPastPaper,
  updatePastPaper,
  deletePastPaper,
  downloadPastPaper,
  getFilterOptions,
  getPaperStatistics
};