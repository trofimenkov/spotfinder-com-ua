const cron = require('node-cron'); //Schedule

const ParkingSpot = require('../models/parkingSpot');
const ParkingSection = require('../models/parkingSection');
//Admin History
const ActionHistoryUtil = require('../utils/actionHistoryUtil');

// Main page
exports.getMainPage = function (req, res) {
    res.render('main');
};

// Parking page
exports.getParkingPage = function (req, res) {
    res.render('parking');
};

// API endpoint
exports.getApiData = async function (req, res) {
    try {
        const parkingSpots = await ParkingSpot.find({}).exec();
        const parkingSections = await ParkingSection.find({}).exec();
        res.json({ parkingSpots: parkingSpots, parkingSections: parkingSections });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Error' });
    }
};

exports.checkAndReleaseParkingSpot = async function (spot) {
    const currentDateTime = new Date();
    if (currentDateTime > spot.exitDateTime) {
        const section = await ParkingSection.findOne({ sectionSpots: spot._id });

        spot.isOccupied = false;
        spot.occupiedBy = '';
        spot.carNumber = '';
        spot.arrivalDateTime = null;
        spot.exitDateTime = null;

        await spot.save();

        ActionHistoryUtil.createActionHistory({
            section: section.sectionName,
            spot: spot,
            actionType: "SpotRelease"
        });
    }
}

exports.updateParkingSpot = async function (data) {
    try {
        const fullName = data.firstname + ' ' + data.lastname;
        const exitDateTime = new Date(data.exitDate + 'T' + data.exitTime);
        const arrivalDateTime = new Date(data.arrivalDate + 'T' + data.arrivalTime);

        const section = await ParkingSection.findOne({ sectionName: data.section });

        if (!section) {
            console.log('Section is not found');
            return;
        }

        const foundSpotId = section.sectionSpots.find(spot => spot._id.toString() === data.spot_id);

        if (!foundSpotId) {
            console.log('Spot inside the section is not found');
            return;
        }

        const foundSpot = await ParkingSpot.findById(foundSpotId);

        if (!foundSpot) {
            console.log('Spot is not found');
            return;
        }

        foundSpot.isOccupied = true;
        foundSpot.occupiedBy = fullName;
        foundSpot.carNumber = data.carNumber;
        foundSpot.arrivalDateTime = arrivalDateTime;
        foundSpot.exitDateTime = exitDateTime;

        await foundSpot.save();
        console.log('Spot is successfully updated');

        ActionHistoryUtil.createActionHistory({
            section: section.sectionName,
            spot: foundSpot,
            actionType: "Booking",
            username: fullName,
            phone: data.phone,
            arrivalDateTime: arrivalDateTime,
            exitDateTime: exitDateTime,
            price: data.price
        });

    } catch (error) {
        console.error('Error updating ParkingSpot:', error);
    }
};

cron.schedule('* * * * *', async () => {
    try {
        const occupiedSpots = await ParkingSpot.find({ isOccupied: true });
        for (const spot of occupiedSpots) {
            await exports.checkAndReleaseParkingSpot(spot);
        }
    } catch (error) {
        console.error('Error occurred during scheduled task:', error);
    }
});

exports.saveData = (req, res) => {
    const formData = req.body;

    console.log('Received data:', formData);

    exports.updateParkingSpot(formData);

    res.json({ success: true });
};