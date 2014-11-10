/**
 * Created by meditech on 06/10/2014.
 */
var passport = require('passport'),
    passportLocal = require('passport-local');
passportHttp = require('passport-http');

var AuthenticationController = require('./controllers/AuthenticationController');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new passportLocal.Strategy({passReqToCallback : true},AuthenticationController.login));


app.get('/',function(req, res) {
    res.sendfile(path.join(clientDir, 'login.html'))
});

app.get('/home',AuthenticationController.authenticated,function(req,res){
    res.sendfile(path.join(clientDir, 'home.html'))
});



app.post('/api/users/login', passport.authenticate('local'),function(req, res) {
        res.send(req.user);
    }
);

app.all('/api/users/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/api/users/register',AuthenticationController.register);
app.get('/api/users/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});