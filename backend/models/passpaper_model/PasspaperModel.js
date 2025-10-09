const mongoose = require('mongoose');

const pastPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Paper title is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    uppercase: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']
   
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['1st Semester', '2nd Semester', 'Summer Semester']
  },
  questions: {
    type: Number,
    required: [true, 'Number of questions is required'],
    min: 1
  },
  timeAllowed: {
    type: String,
    required: [true, 'Time allowed is required']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  modelAnswersUrl: {
    type: String,
    default: null
  },
  modelAnswers: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  department: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Changed to false for no auth
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
pastPaperSchema.index({ year: -1, semester: 1 });
pastPaperSchema.index({ code: 1, year: -1 });
pastPaperSchema.index({ tags: 1 });
pastPaperSchema.index({ title: 'text', code: 'text' });

// Virtual for subject name extraction
pastPaperSchema.virtual('subjectName').get(function() {
  return this.title.split(' - ')[0];
});

// Method to increment download count
pastPaperSchema.methods.incrementDownload = async function() {
  this.downloadCount += 1;
  return this.save();
};

// Static method to get paper statistics
pastPaperSchema.statics.getStatistics = async function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalPapers: { $sum: 1 },
        papersWithAnswers: {
          $sum: { $cond: ['$modelAnswers', 1, 0] }
        },
        totalDownloads: { $sum: '$downloadCount' },
        yearRange: {
          $push: '$year'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalPapers: 1,
        papersWithAnswers: 1,
        totalDownloads: 1,
        minYear: { $min: '$yearRange' },
        maxYear: { $max: '$yearRange' }
      }
    }
  ]);
};

const PastPaper = mongoose.model('PastPaper', pastPaperSchema);

module.exports = PastPaper;