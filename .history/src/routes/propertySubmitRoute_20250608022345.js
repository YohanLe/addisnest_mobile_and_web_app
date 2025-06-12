const express = require('express');
const { propertyController } = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/property-submit
 * @desc    Submit a property and set it to pending_payment status
 * @access  Private
 */
router.post('/', protect, propertyController.submitPropertyPending);

module.exports = router;
