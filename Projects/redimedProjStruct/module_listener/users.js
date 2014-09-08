var users = require('./routes/users');

app.post('/users/register',users.register);
app.post('/users/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});
app.get('/users/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/users/logout', function(req, res){
    req.logOut();
    res.send(200);
});

app.post('/users/home',users.loadMenu);