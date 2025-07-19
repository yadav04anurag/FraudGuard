const express = require('express');
const router = express.Router();
const { getUsers, updateUser } = require('../controllers/userController'); // Import updateUser
const { authenticate, authorize } = require('../middleware/auth');

// All routes in this file are protected and for admins only
router.use(authenticate, authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUser); // Add the PUT route for a specific user ID

module.exports = router;