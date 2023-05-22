const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const promoController = require('../controllers/promoController');

// Main page
router.get('/', parkingController.getMainPage);

// Parking page
router.get('/parking', parkingController.getParkingPage);

// Get parking data
router.get('/api/data', parkingController.getApiData);

// Save parking data
router.post('/api/save-data', parkingController.saveData);

module.exports = router;