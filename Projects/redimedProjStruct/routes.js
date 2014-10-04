var passport = require('passport'),
    passportLocal = require('passport-local');
    passportHttp = require('passport-http');

//---------------------------------Controllers------------------------------------
var AuthenticationController = require('./controllers/AuthenticationController');
var MenuController = require('./controllers/MenuController');
var CompanyController = require('./controllers/CompanyController');
var FunctionController = require('./controllers/FunctionController');
var BookingController = require('./controllers/BookingController');
var RedimedSiteController = require('./controllers/RedimedSiteController');
var PackageController = require('./controllers/PackageController');
var UserController = require('./controllers/UserController');
var AssessmentController = require('./controllers/AssessmentController');
var CalendarController = require('./controllers/CalendarController');

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

app.post('/api/users/login', passport.authenticate('local'),function(req, res) {
            res.send(req.user);
        }
);

app.all('/api/users/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/api/company/list',CompanyController.companyList);
app.post('/api/company/sub',CompanyController.subCompany);
app.post('/api/company/info',CompanyController.companyInfo);
app.post('/api/company/insert',CompanyController.insert);
app.post('/api/company/edit',CompanyController.edit);

app.post('/api/users/home',MenuController.loadSideMenu);
app.post('/api/users/register',AuthenticationController.register);
app.get('/api/users/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
app.post('/api/users/company',UserController.userByCompany);
app.post('/api/users/id',UserController.getUserById);
app.post('/api/users/insert',UserController.insertUser);
app.post('/api/users/edit',UserController.editUser);
app.post('/api/users/changePass',UserController.changePass);
app.get('/api/users/list',UserController.list);
app.get('/api/users/employee/list',UserController.employeeList);

app.get('/api/assessment/header',AssessmentController.headerList);
app.post('/api/assessment/header/remove',AssessmentController.removeHeader);
app.post('/api/assessment/header/insert',AssessmentController.insertHeader);
app.get('/api/assessment',AssessmentController.getAssessment);
app.post('/api/assessment/remove',AssessmentController.removeAssessment);
app.post('/api/assessment/insert',AssessmentController.insertAssessment);

app.post('/api/package/assessment/id',PackageController.packageAssById);
app.get('/api/package/assessment',PackageController.packageAss);
app.post('/api/package/assessment/update',PackageController.updateAss);
app.post('/api/package/insert',PackageController.insertPackage);
app.post('/api/package/assessment/delete',PackageController.deleteAss);
app.post('/api/package/assessment/insert',PackageController.insertAss);


app.post('/api/booking/packageList', BookingController.packageList);
app.post('/api/booking/list/companyId',BookingController.bookingListByCompany);
app.get('/api/booking/list',BookingController.bookingList);
app.post('/api/booking/detail',BookingController.bookingDetail);
app.post('/api/booking/cancel',BookingController.cancelBooking);
app.post('/api/booking/calendar',BookingController.calendarList);
app.post('/api/booking/appointmentTime',BookingController.appointmentTime);
app.post('/api/booking/changeBookingTime',BookingController.changeBookingTime);
app.post('/api/booking/deletePackage',BookingController.removePackage);
app.get('/api/booking/assList',BookingController.assList);
app.post('/api/booking/position/list',BookingController.positionList);
app.post('/api/booking/position/delete',BookingController.deletePosition);
app.post('/api/booking/position/insert',BookingController.insertPosition);
app.post('/api/booking/submit',BookingController.submitBooking);
app.post('/api/booking/edit',BookingController.editBooking);
app.post('/api/booking/confirm',BookingController.confirmBooking);

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

app.get('/api/redimedsite/list',RedimedSiteController.list);
app.post('/api/redimedsite/info',RedimedSiteController.siteInfo);
app.post('/api/redimedsite/insert',RedimedSiteController.insert);
app.post('/api/redimedsite/edit',RedimedSiteController.edit);

app.get('/api/calendar/list',CalendarController.list);
app.post('/api/calendar/siteId',CalendarController.getBySite);
app.post('/api/calendar/id',CalendarController.getById);
app.post('/api/calendar/submit',CalendarController.submit);
