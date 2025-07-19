const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes are protected and require 'admin' role
router.use(authenticate, authorize('admin'));

// Get all data
router.get('/data', adminController.getAllFraudData);

// Fraud App Routes
router.route('/apps')
  .post(adminController.createFraudApp);
router.route('/apps/:id')
  .put(adminController.updateFraudApp)
  .delete(adminController.deleteFraudApp);

// Fraud URL Routes
router.route('/urls')
  .post(adminController.createFraudUrl);
router.route('/urls/:id')
  .put(adminController.updateFraudUrl)
  .delete(adminController.deleteFraudUrl);

module.exports = router;