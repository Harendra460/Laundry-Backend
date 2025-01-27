"use strict";

var express = require('express');
var router = express.Router();
var _require = require('../controllers/VendorSearch'),
  VendorSearch = _require.VendorSearch;
var _require2 = require('../config/jwt'),
  protect = _require2.protect;

// Apply auth middleware to all routes
router.use(protect);
router.get("/vendors/search", VendorSearch);
module.exports = router;