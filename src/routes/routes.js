const express = require('express');
const router = express.Router();
const {VendorSearch} = require('../controllers/VendorSearch')
const {protect} = require('../config/jwt');

// Apply auth middleware to all routes
router.use(protect);

router.get(`/vendors/search`, VendorSearch)

module.exports = router