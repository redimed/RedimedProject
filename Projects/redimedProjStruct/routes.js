var passport = require('passport'),
    passportLocal = require('passport-local');
    passportHttp = require('passport-http');

//---------------------------------Controllers------------------------------------
var AuthenticationController = require('./controllers/AuthenticationController');
var MenuController = require('./controllers/MenuController');
var CompanyController = require('./controllers/CompanyController');
var FunctionController = require('./controllers/FunctionController');

var rl_types=require('./routes/rl_types');
var cln_specialties=require('./routes/cln_specialities');
var redimedsites=require('./routes/redimedsites');
var doctors = require('./routes/doctors');
var appointmentCalendar = require('./routes/appointment_calendar');
var rl_bookings=require('./routes/rl_bookings');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new passportLocal.Strategy({passReqToCallback : true},AuthenticationController.login));


//-----------------------------------Routes--------------------------------------
app.get('/',function(req, res) {
    res.sendfile(path.join(clientDir, 'login.html'))
});


app.get('/home',AuthenticationController.authenticated,function(req,res){
    res.sendfile(path.join(clientDir, 'home.html'))
});

app.post('/users/login', passport.authenticate('local'),function(req, res) {
            res.send(req.user);
        }
);

app.all('/users/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/users/home',MenuController.loadSideMenu);

app.get('/users/companyList',CompanyController.companyList);

app.post('/users/register',AuthenticationController.register);

app.get('/users/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.get('/api/rlob/rl_types/list',rl_types.list);
app.get('/api/rlob/cln_specialties/list',cln_specialties.list);
app.get('/api/rlob/redimedsites/list',redimedsites.list);
app.get('/api/rlob/doctors/list',doctors.list);
app.get('/api/rlob/doctors/get-doctors-by-speciality',doctors.getDoctorOfSpeciality);
app.get('/api/rlob/appointment-calendar/list',appointmentCalendar.list);
app.get('/api/rlob/appointment-calendar/get-appointment-calendar',appointmentCalendar.getAppointmentCalendar);
app.post('/api/rlob/rl_bookings/add',rl_bookings.add);
app.get('/api/rlob/rl_bookings/get-new-key',rl_bookings.getNewKey);
app.get('/api/rlob/rl_bookings/list',rl_bookings.list);


app.get('/api/menu/list',MenuController.list);
app.post('/api/menu/edit',MenuController.edit);
app.post('/api/menu/insert',MenuController.insert);
app.post('/api/menu/editChild',MenuController.editChild);
app.post('/api/menu/insertChild',MenuController.insertChild);

app.get('/api/function/list',FunctionController.list);
app.post('/api/function/edit',FunctionController.edit);
app.post('/api/function/insert',FunctionController.insert);
