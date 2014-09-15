var users = require('./routes/users'),
    passport = require('passport');
var AuthenticationController = require('./controllers/AuthenticationController');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        // add code here for local strategy
    }
));

module.exports = function(app) {
    /**
     * Sign in
     */
    app.post('/sign-in', passport.authenticate('local',
            {
                successRedirect: '/',
                failureRedirect: '/'
            })
    );

    /**
     * Sign out
     */
    app.all('/sign-out', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/test', AuthenticationController.authenticated, AuthenticationController.sampleActionRequiredSignIn);
};