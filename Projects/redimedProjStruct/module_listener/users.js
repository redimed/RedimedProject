var users = require('./routes/users');

app.post('/users/register',users.register);
app.post('/users/login',users.login);
