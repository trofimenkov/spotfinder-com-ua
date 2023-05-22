const passport = require('../passport');
const User = require('../models/userData');
const Promo = require('../models/promoData');
const ParkingSection = require('../models/parkingSection');
const ParkingSpot = require('../models/parkingSpot');
const ActionHistoryUtil = require('../utils/actionHistoryUtil');
// Admin page
exports.getAdminPage = function (req, res) {
    if (req.isAuthenticated()) {
        const username = req.user.username;
        res.render('admin', { username: username });
    } else {
        res.redirect('/admin/login');
    }
};

// Login page
exports.getLoginPage = function (req, res) {
    res.render('login', { messages: req.flash('error') });
};

// Login processing
exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/admin/login');
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/admin');
        });
    })(req, res, next);
};

// Logout
exports.logout = function (req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

exports.createUser = async function (req, res) {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};


exports.createPromo = async function (req, res) {
    try {
        const { promocode, discount } = req.body;
        const promo = new Promo({ promocode, discount });
        await promo.save();
        res.status(201).json({ message: 'Promo code created successfully' });
        ActionHistoryUtil.createActionHistory({
            actionType: "PromoCodeCreation",
            createdBy: req.user.username,
            promoCode: promocode,
            promoDiscount: discount
        });
    } catch (error) {
        console.error('Error creating promo code:', error);
        res.status(500).json({ error: 'Failed to create promo code' });
    }
};

exports.clearActionHistory = async function (req, res) {
    try {
        await ActionHistoryUtil.clearActionHistory();
        res.json({ message: 'Action history cleared successfully' });
    } catch (error) {
        console.error('Error clearing action history:', error);
        res.status(500).json({ error: 'Failed to clear action history' });
    }
};

/* SECTIONS AND SPOTS */

exports.createSection = async function (req, res) {
    try {
        const { sectionName, sectionAddress, hourlyRate } = req.body;

        const section = new ParkingSection({ sectionName, sectionAddress, hourlyRate });
        await section.save();
        console.log(section);
        res.status(201).json({ message: 'Section created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Section' });
    }
};

exports.getSections = async function (req, res) {
    try {
        const sections = await ParkingSection.find();
        res.status(200).json({ sections });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get sections' });
    }
};

exports.addSpot = async function (req, res) {
    try {
        const { sectionId } = req.body;

        const section = await ParkingSection.findById(sectionId);
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }
        const spotNumber = section.sectionSpots.length + 1;
        const spot = new ParkingSpot({ spotNumber });
        console.log('Spot data:', spot);
        const savedSpot = await spot.save();
        section.sectionSpots.push(savedSpot);
        console.log('Section data:', section);
        await section.save();
        res.status(201).json({ message: 'Spot data logged successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add spot' });
    }
};