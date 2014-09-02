var users = require('./routes/users');

app.post('/users/login',users.login);
app.post('/users/register',users.register);