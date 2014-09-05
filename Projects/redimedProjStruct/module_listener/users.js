var users = require('./routes/users');

app.post('/users/register',users.register);
app.post('/users/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});
