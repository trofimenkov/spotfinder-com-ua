const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/userData');

passport.use(new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    function (username, password, done) {
        User.findOne({ username: username })
            .then(user => {
                if (!user || user.password !== password) {
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                return done(null, user);
            })
            .catch(err => done(err));
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

module.exports = passport;