//DECLARE
var mdtDoctorController = require('./controllers/mdtDoctorController');
var mdtPatientController = require('./controllers/mdtPatientController');
var mdtWaitingListController = require('./controllers/mdtWaitingListController');
var mdtClaimController = require('./controllers/mdtClaimController');
var mdtAppointmentController = require('./controllers/mdtAppointmentController');
var mdtCompanyController = require('./controllers/mdtCompanyController');

//MODULE DOCTOR
app.post("/api/meditek/v1/doctor/search", mdtDoctorController.postSearch);
app.get("/api/meditek/v1/doctor/dropdown", mdtDoctorController.getDropdown);

//MODULE PATIENT
app.post("/api/meditek/v1/patient/search", mdtPatientController.postSearch);
app.post("/api/meditek/v1/patient/add", mdtPatientController.postAdd);
app.post("/api/meditek/v1/patient/edit", mdtPatientController.postEdit);
app.get("/api/meditek/v1/patient/dropdown", mdtPatientController.getDropdown);
app.post("/api/meditek/v1/patient/byId", mdtPatientController.postById);

//MODULE WAITING LIST
app.post("/api/meditek/v1/patient/waiting_list/add", mdtWaitingListController.postAdd);
app.post("/api/meditek/v1/doctor/waiting_list/search", mdtWaitingListController.postSearch);

//MODULE CLAIM
app.post("/api/meditek/v1/patient/claim/search", mdtClaimController.postSearch);
app.post("/api/meditek/v1/patient/claim/add", mdtClaimController.postAdd);

//MODULE APPOINTMENT
app.get("/api/meditek/v1/appointment/byId", mdtAppointmentController.postById);

//MODULE COMPANY
app.post("/api/meditek/v1/company/search", mdtCompanyController.postSearch);
//app.post("/api/meditek/v1/company/byId", mdtCompanyController.postById);

/*AUTO CREATE*/
var ScriptController = require('./controllers/ScriptController');

app.post('/api/meditek/v1/script/search', ScriptController.postSearch);
app.post('/api/meditek/v1/script/add', ScriptController.postAdd);
app.post('/api/meditek/v1/script/edit', ScriptController.postEdit);
app.post('/api/meditek/v1/script/byId', ScriptController.postById);

var ReferralController = require('./controllers/ReferralController');

app.post('/api/meditek/v1/referral/search', ReferralController.postSearch);
app.post('/api/meditek/v1/referral/add', ReferralController.postAdd);
app.post('/api/meditek/v1/referral/edit', ReferralController.postEdit);
app.post('/api/meditek/v1/referral/byId', ReferralController.postById);


var SysServicesController = require('./controllers/SysServicesController');

app.post('/api/meditek/v1/sysservices/search', SysServicesController.postSearch);
app.post('/api/meditek/v1/sysservices/add', SysServicesController.postAdd);
app.post('/api/meditek/v1/sysservices/edit', SysServicesController.postEdit);
app.post('/api/meditek/v1/sysservices/byId', SysServicesController.postById);

/*END AUTO CREATE*/

var mdtAutoController = require('./controllers/mdtAutoController');
app.get("/api/meditek/v1/auto/module", mdtAutoController.postModule);