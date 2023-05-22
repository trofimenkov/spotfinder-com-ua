const mongoose = require('mongoose');

const actionHistorySchema = new mongoose.Schema({
    section: { type: String },
    spotNumber: { type: Number },
    actionType: { type: String },
    fullname: { type: String },
    price: { type: Number },
    arrivalDateTime: { type: Date },
    exitDateTime: { type: Date },
    message: { type: String },
    createdBy: { type: String },
    deletedBy: { type: String },
    promoCode: { type: String },
    promoDiscount: { type: Number },
    createdAt: { type: String },
});
const ActionHistory = mongoose.model('ActionHistory', actionHistorySchema);

module.exports = ActionHistory;