const express = require('express');
const router = express.Router();
const {
  getPastPapers,
  getPastPaperById,
  createPastPaper,
  updatePastPaper,
  deletePastPaper,
  downloadPastPaper,
  getFilterOptions,
  getPaperStatistics
} = require('../../controllers/Passpaper_Controller/PasspaperC');

// ==========================================
// ALL ROUTES ARE PUBLIC (NO AUTHENTICATION)
// ==========================================

// GET /pastpapers - Get all past papers with filtering
router.get('/display', getPastPapers);

// GET /pastpapers/filters/options - Get filter options
router.get('/filters/options', getFilterOptions);

// GET /pastpapers/admin/stats - Get statistics
router.get('/mentor/stats', getPaperStatistics);

// GET /pastpapers/:id - Get single past paper
router.get('/add/:id', getPastPaperById);

// GET /pastpapers/:id/download - Download paper
router.get('/:id/download', downloadPastPaper);

// POST /pastpapers - Create new paper
router.post('/add', createPastPaper);

// PUT /pastpapers/:id - Update paper
router.put('/update/:id', updatePastPaper);

// DELETE /pastpapers/:id - Delete paper
router.delete('/delete/:id', deletePastPaper);

module.exports = router;