const moment = require('moment');
const ActionHistory = require('../models/actionHistory');

exports.createActionHistory = async function ({
    section = '',
    spot = '',
    actionType,
    username = '',
    phone = '',
    price = 0,
    arrivalDateTime = null,
    exitDateTime = null,
    createdBy = '',
    deletedBy = '',
    promoCode = '',
    promoDiscount = ''
}) {
    try {
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

        let message;

        switch (actionType) {
            case 'Booking':
                /* ### CHANGE DATATIME FORMAT ### */
                const arrivalDateTimeStr = arrivalDateTime ? moment(arrivalDateTime).format('YYYY-MM-DD HH:mm:ss') : '';
                const exitDateTimeStr = exitDateTime ? moment(exitDateTime).format('YYYY-MM-DD HH:mm:ss') : '';
                /* ############################ */
                message = `<strong>${section}</strong>: <strong>${username}</strong> (<strong>${phone}</strong>) booking a parking spot №<strong>${spot.spotNumber}</strong> for <strong>${price}$</strong> (ArrivalDateTime: <strong>${arrivalDateTimeStr}</strong> | ExitDateTime: <strong>${exitDateTimeStr}</strong>)`;
                break;
            case 'SpotRelease':
                message = `<strong>${section}</strong>: Parking Spot №<strong>${spot.spotNumber}</strong> is <strong>available</strong> now.`;
                break;
            case 'PromoCodeCreation':
                message = `Promo code (<strong>${promoCode}</strong>) created by <strong>${createdBy}</strong> with a discount of <strong>${promoDiscount}%</strong>.`;
                break;
            default:
                message = '';
        }
        const action = new ActionHistory({
            section: section,
            spotNumber: spot.spotNumber,
            actionType: actionType,
            username: username,
            phone: phone,
            price: price,
            arrivalDateTime: arrivalDateTime,
            exitDateTime: exitDateTime,
            message: message,
            createdBy: createdBy,
            deletedBy: deletedBy,
            promoCode: promoCode,
            promoDiscount: promoDiscount,
            createdAt: currentDate
        });

        await action.save();
        console.log('Action saved successfully:', action);
    } catch (error) {
        console.error('Error creating action history:', error);
    }
};

exports.clearActionHistory = async function () {
    try {
        await ActionHistory.deleteMany();
        console.log('Action history cleared successfully');
    } catch (error) {
        console.error('Error clearing action history:', error);
    }
};