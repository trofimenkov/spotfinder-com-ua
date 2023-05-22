const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('./passport');
const flash = require('connect-flash');
const ejs = require('ejs');
const app = express();
app.use(bodyParser.json());

/* #### MIDDLEWARE #### */
app.use(flash());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/* #### DATABASE CONNECTION #### */
mongoose.connect('mongodb+srv://toleksandr:Ekdyuwgxn7AJJWw@cluster0.kvuqgur.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

/* #### ROUTES #### */
const parkingRoutes = require('./routes/parkingRoutes');
const adminRoutes = require('./routes/adminRoutes.js');
app.use('/', parkingRoutes);
app.use('/admin', adminRoutes);

/* #### SERVER CONNECTION ERROR HANDLER #### */
app.use(function (err, req, res, next) {
    if (err.name === 'MongoError') {
        console.error('MongoDB error:', err.message);
        res.status(500).send('MongoDB error: ' + err.message);
    } else {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    }
});

/* #### STARTING SERVER #### */
app.listen(3000, () => {
    console.log('App listening on port 3000');
});