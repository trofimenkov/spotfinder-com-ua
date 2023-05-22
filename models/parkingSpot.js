const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    spotNumber: { type: Number, required: true },
    isOccupied: { type: Boolean, default: false },
    occupiedBy: String,
    carNumber: String,
    arrivalDateTime: { type: Date },
    exitDateTime: { type: Date },
});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

module.exports = ParkingSpot;