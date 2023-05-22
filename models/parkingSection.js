const mongoose = require('mongoose');

const parkingSectionSchema = new mongoose.Schema({
    sectionName: { type: String, required: true },
    sectionAddress: { type: String, required: true },
    sectionSpots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot' }],
    hourlyRate: { type: Number, required: true }
});

const ParkingSection = mongoose.model('ParkingSection', parkingSectionSchema);

module.exports = ParkingSection;