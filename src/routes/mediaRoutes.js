const express = require('express');
const { mediaController } = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/media/upload
 * @desc    Upload media files
 * @access  Private
 */
router.post('/upload', protect, mediaController.uploadMedia);

module.exports = router;
