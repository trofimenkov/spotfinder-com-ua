const ActionHistory = require('../models/actionHistory');

/* GET HISTORY DATA */
exports.getHistory = async function (req, res) {
    try {
        const actionHistoryData = await ActionHistory.find({}, 'message createdAt actionType')
            .sort({ createdAt: -1 })
            .lean();
        res.json(actionHistoryData);
    } catch (error) {
        console.error('Error retrieving action history data:', error);
        res.status(500).json({ error: 'Failed to retrieve action history' });
    }
};