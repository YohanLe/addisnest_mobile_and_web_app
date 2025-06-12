const express = require('express');
const { propertyController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/user/:userId', propertyController.getPropertiesByUser);

// Protected routes (require authentication)
router.use(protect);
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
router.put('/:id/photos', propertyController.uploadPropertyPhotos);

module.exports = router;
