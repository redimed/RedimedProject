
var DoctorController = require('./controllers/doctorsController');
var AppointmentController = require('./controllers/clnAppointmentCalendarController');
var ClinicalController = require('./controllers/clnClinicalDeptController');
var SystemController = require('./controllers/SystemController');
var CompanyController = require('./controllers/CompanyController');

//KHANH
var ClientController = require('./controllers/ClientController');
//END KHANH

//--------------------------------------------------------------------------
var RedimedSiteController = require('./controllers/RedimedSiteController');
app.get('/api/erm/redimedsites/list', RedimedSiteController.list);


app.get('/api/erm/doctors/list', DoctorController.list_bv);
app.post('/api/erm/doctors/search', DoctorController.search);
app.post('/api/erm/doctors/listByClinical', DoctorController.listByClinical);
app.post('/api/erm/doctors/getById', DoctorController.getById);
app.post('/api/erm/doctors/timetable', DoctorController.timetable);
app.post('/api/erm/doctors/timetableWeekById', DoctorController.timetableWeekById);
app.post('/api/erm/doctors/changeTimetableWeek', DoctorController.changeTimetableWeek);
app.post('/api/erm/doctors/insertTimetableWeek', DoctorController.insertTimetableWeek);
app.post('/api/erm/doctors/removeTimetableWeek', DoctorController.removeTimetableWeek);
app.post('/api/erm/doctors/updateTimetable', DoctorController.updateTimetable);
app.post('/api/erm/doctors/changeTimetable', DoctorController.changeTimetable);
app.post('/api/erm/doctors/insertTimetable', DoctorController.insertTimetable);
app.post('/api/erm/doctors/removeTimetable', DoctorController.removeTimetable);
app.post('/api/erm/doctors/generateTimetable', DoctorController.generateTimetable);
app.post('/api/erm/doctors/getCasualCalendar', DoctorController.getCasualCalendar);
app.get('/api/erm/doctors/getMaxId', DoctorController.getMaxId);
app.post('/api/erm/doctors/update', DoctorController.update);
app.post('/api/erm/doctors/insert', DoctorController.insert);
app.post('/api/erm/doctors/changeCasual', DoctorController.changeCasual);


app.post('/api/erm/appointment/get', AppointmentController.getAppointmentCalendar_bv);
app.post('/api/erm/appointment/update', AppointmentController.bookingUpdate);
app.post('/api/erm/appointment/delete', AppointmentController.bookingDelete);
app.post('/api/erm/appointment/overview', AppointmentController.overviewAppointmentCalendar);
app.post('/api/erm/appointment/booking', AppointmentController.booking);
app.post('/api/erm/appointment/getById', AppointmentController.getById);


//SYSTEM
app.post('/api/erm/system/listServiceByClinical', SystemController.listServiceByClinical);

/* KHANH RESPONSIBILITY */
app.get('/api/patient/totals', ClientController.getTotals);
app.get('/api/patient/list_account_type', ClientController.getAccountTypeList);
app.get('/api/erm/patient/list_account_type', ClientController.getAccountTypeList);
app.get('/api/patient/list_private_fund', ClientController.getPrivateFundList);
app.get('/api/erm/patient/list_provider_type', ClientController.getProviderTypeList);
app.get('/api/erm/patient/qualification', ClientController.getQualificationList);
app.post('/api/patient/insert', ClientController.insert);
app.post('/api/patient/update', ClientController.update);

app.post('/api/patient/get_by_id', ClientController.getById);
app.post('/api/patient/get_by_option', ClientController.getByOptions);
app.get('/api/patient/tesst', ClientController.test);


/* END KHANH RESPONSIBILITY */

// COMPANY
 app.post('/api/erm/company/getDetail', CompanyController.getDetail);
 // END COMPANY
 
 //dqt
app.post('/api/patient/getReferral', ClientController.getReferral);
app.post('/api/patient/insertReferral', ClientController.insertReferral);
app.post('/api/patient/updateReferral', ClientController.updateReferral);

app.post('/api/patient/getScript', ClientController.getScript);
app.post('/api/patient/updateScript', ClientController.updateScript);
app.post('/api/patient/insertScript', ClientController.insertScript);
//end dqt

app.get("/api/v1/skinapp/patient/getAll", ClientController.getAll);
app.post("/api/v1/skinapp/patient/image", ClientController.getSkinAppImage);
app.post("/api/v1/skinapp/patient/add", ClientController.addSkinApp);
app.post("/api/v1/skinapp/patient/getFields", ClientController.getFields);
app.post("/api/v1/skinapp/patient/update", ClientController.updateSkinApp);

/**
 *  KHANK CONVERTOR
 */

 //app.get('/api/erm/clinicals/list', ClinicalController.list);

k_route.setRoute(app, ClinicalController, '/api/erm/clinicals/');
//k_route.setRoute(app, ClientController, '/api/erm/patient/');