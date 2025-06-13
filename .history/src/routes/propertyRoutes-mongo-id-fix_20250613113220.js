const express = require('express');
const { propertyController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');
const { createPropertyByMongoIdHandler } = require('../controllers/property-mongo-id-fix');

const router = express.Router();

// Apply the MongoDB ID lookup fix (adds the /mongo-id/:id and /direct-db-query/:id routes)
// This MUST be done before other routes are registered to ensure the correct order
createPropertyByMongoIdHandler(router, propertyController);

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/user/:userId', propertyController.getPropertiesByUser);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (require authentication)
router.use(protect);
router.post('/', authorize('agent', 'customer', 'admin'), propertyController.createProperty);
router.put('/:id', authorize('agent', 'customer', 'admin'), propertyController.updateProperty);
router.delete('/:id', authorize('agent', 'customer', 'admin'), propertyController.deleteProperty);
router.put('/:id/photos', authorize('agent', 'customer', 'admin'), propertyController.uploadPropertyPhotos);

module.exports = router;
