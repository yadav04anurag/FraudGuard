const express = require('express');
const router = express.Router();
const { getPublicFraudData, reportFraudUrl } = require('../controllers/fraudDataController');
const { authenticate } = require('../middleware/auth');

// All routes in this file are protected for any logged-in user
router.use(authenticate);

router.route('/')
  .get(getPublicFraudData);

router.route('/report')
  .post(reportFraudUrl);

module.exports = router;