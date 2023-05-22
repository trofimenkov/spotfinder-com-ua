const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    promocode: { type: String, required: true },
    discount: { type: Number, required: true }
});

const Promo = mongoose.model('Promo', promoSchema);

module.exports = Promo;