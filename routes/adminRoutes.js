const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const historyController = require('../controllers/historyController');

// Admin page
router.get('/', adminController.getAdminPage);

// Login page
router.get('/login', adminController.getLoginPage);

// Login processing
router.post('/login', adminController.login);

// Logout
router.get('/logout', adminController.logout);

// Admin History
router.get('/api/admin-history', historyController.getHistory);

// Clear Admin History
router.post('/clear-history', adminController.clearActionHistory);

// Create Admin Account
router.post('/create-admin', adminController.createUser);

// Create Promo-Code
router.post('/create-promo', adminController.createPromo);

// Create Parking Section
router.post('/create-section', adminController.createSection);

// Get Parking Section
router.get('/sections', adminController.getSections);

// Create Parking Spot
router.post('/add-spot', adminController.addSpot);

module.exports = router;