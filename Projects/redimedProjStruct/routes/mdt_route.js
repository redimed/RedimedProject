//DECLARE
var mdtDoctorController = require('./controllers/mdtDoctorController');
var mdtPatientController = require('./controllers/mdtPatientController');
var mdtWaitingListController = require('./controllers/mdtWaitingListController');
var mdtClaimController = require('./controllers/mdtClaimController');
var mdtAppointmentController = require('./controllers/mdtAppointmentController');
var mdtCompanyController = require('./controllers/mdtCompanyController');

//MODULE DOCTOR
app.post("/api/meditek/v1/doctor/search", mdtDoctorController.postSearch);

//MODULE PATIENT
app.post("/api/meditek/v1/patient/search", mdtPatientController.postSearch);
app.post("/api/meditek/v1/patient/add", mdtPatientController.postAdd);
app.post("/api/meditek/v1/patient/edit", mdtPatientController.postEdit);
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
app.post("/api/meditek/v1/company/byId", mdtCompanyController.postById);

//MODULE TIMETABLE
var mdtTimetableController = require('./controllers/mdtTimetableController');

app.post('/api/meditek/v1/mdttimetable/byDoctor', mdtTimetableController.postByDoctor);
app.post('/api/meditek/v1/mdttimetable/showWeek', mdtTimetableController.showWeek);
app.post('/api/meditek/v1/mdttimetable/addSite', mdtTimetableController.addSite);
app.post('/api/meditek/v1/mdttimetable/add', mdtTimetableController.add);
app.post('/api/meditek/v1/mdttimetable/generate', mdtTimetableController.generate);

/*AUTO CREATE*/
var sysStateController = require('./controllers/sysStateController');

app.post('/api/meditek/v1/sysstate/list', sysStateController.postList);
app.post('/api/meditek/v1/sysstate/search', sysStateController.postSearch);
app.post('/api/meditek/v1/sysstate/add', sysStateController.postAdd);
app.post('/api/meditek/v1/sysstate/edit', sysStateController.postEdit);
app.post('/api/meditek/v1/sysstate/byId', sysStateController.postById);

var sysCountryController = require('./controllers/sysCountryController');

app.get('/api/meditek/v1/syscountry/list', sysCountryController.getList);
app.post('/api/meditek/v1/syscountry/search', sysCountryController.postSearch);
app.post('/api/meditek/v1/syscountry/add', sysCountryController.postAdd);
app.post('/api/meditek/v1/syscountry/edit', sysCountryController.postEdit);
app.post('/api/meditek/v1/syscountry/byId', sysCountryController.postById);

var mdtRedimedsitesController = require('./controllers/mdtRedimedsitesController');

app.get('/api/meditek/v1/mdtredimedsites/list', mdtRedimedsitesController.getList);
app.post('/api/meditek/v1/mdtredimedsites/search', mdtRedimedsitesController.postSearch);
app.post('/api/meditek/v1/mdtredimedsites/add', mdtRedimedsitesController.postAdd);
app.post('/api/meditek/v1/mdtredimedsites/edit', mdtRedimedsitesController.postEdit);
app.post('/api/meditek/v1/mdtredimedsites/byId', mdtRedimedsitesController.postById);

var sysServiceController = require('./controllers/sysServiceController');

app.post('/api/meditek/v1/sysservice/search', sysServiceController.postSearch);
app.post('/api/meditek/v1/sysservice/add', sysServiceController.postAdd);
app.post('/api/meditek/v1/sysservice/edit', sysServiceController.postEdit);
app.post('/api/meditek/v1/sysservice/byId', sysServiceController.postById);
app.post('/api/meditek/v1/sysservice/byClinicalDepartment', sysServiceController.postByClinicalDepartment);

var sysrlTypesController = require('./controllers/sysrlTypesController');

app.get('/api/meditek/v1/sysrltypes/list', sysrlTypesController.getList);
app.post('/api/meditek/v1/sysrltypes/search', sysrlTypesController.postSearch);
app.post('/api/meditek/v1/sysrltypes/add', sysrlTypesController.postAdd);
app.post('/api/meditek/v1/sysrltypes/edit', sysrlTypesController.postEdit);
app.post('/api/meditek/v1/sysrltypes/byId', sysrlTypesController.postById);

var mdtSpecialtyController = require('./controllers/mdtSpecialtyController');

app.post('/api/meditek/v1/mdtspecialty/search', mdtSpecialtyController.postSearch);
app.post('/api/meditek/v1/mdtspecialty/add', mdtSpecialtyController.postAdd);
app.post('/api/meditek/v1/mdtspecialty/edit', mdtSpecialtyController.postEdit);
app.post('/api/meditek/v1/mdtspecialty/byId', mdtSpecialtyController.postById);

var sysQualificationController = require('./controllers/sysQualificationController');

app.get('/api/meditek/v1/sysqualification/list', sysQualificationController.getList);
app.post('/api/meditek/v1/sysqualification/search', sysQualificationController.postSearch);
app.post('/api/meditek/v1/sysqualification/add', sysQualificationController.postAdd);
app.post('/api/meditek/v1/sysqualification/edit', sysQualificationController.postEdit);
app.post('/api/meditek/v1/sysqualification/byId', sysQualificationController.postById);

var mdtDeptController = require('./controllers/mdtDeptController');

app.get('/api/meditek/v1/mdtdept/list', mdtDeptController.getList);
app.post('/api/meditek/v1/mdtdept/search', mdtDeptController.postSearch);
app.post('/api/meditek/v1/mdtdept/add', mdtDeptController.postAdd);
app.post('/api/meditek/v1/mdtdept/edit', mdtDeptController.postEdit);
app.post('/api/meditek/v1/mdtdept/byId', mdtDeptController.postById);

var mdtProviderController = require('./controllers/mdtProviderController');

app.get('/api/meditek/v1/mdtprovider/list', mdtProviderController.getList);
app.post('/api/meditek/v1/mdtprovider/search', mdtProviderController.postSearch);
app.post('/api/meditek/v1/mdtprovider/add', mdtProviderController.postAdd);
app.post('/api/meditek/v1/mdtprovider/edit', mdtProviderController.postEdit);
app.post('/api/meditek/v1/mdtprovider/byId', mdtProviderController.postById);

var sysTitleController = require('./controllers/sysTitleController');

app.get('/api/meditek/v1/systitle/list', sysTitleController.getList);
app.post('/api/meditek/v1/systitle/search', sysTitleController.postSearch);
app.post('/api/meditek/v1/systitle/add', sysTitleController.postAdd);
app.post('/api/meditek/v1/systitle/edit', sysTitleController.postEdit);
app.post('/api/meditek/v1/systitle/byId', sysTitleController.postById);

var mdtDoctorController = require('./controllers/mdtDoctorController');

app.post('/api/meditek/v1/mdtdoctor/specialities', mdtDoctorController.postListSpeciality);
app.post('/api/meditek/v1/mdtdoctor/search', mdtDoctorController.postSearch);
app.post('/api/meditek/v1/mdtdoctor/add', mdtDoctorController.postAdd);
app.post('/api/meditek/v1/mdtdoctor/edit', mdtDoctorController.postEdit);
app.post('/api/meditek/v1/mdtdoctor/byId', mdtDoctorController.postById);

app.get('/v1/test', mdtDoctorController.test);

var DepartmentController = require('./controllers/DepartmentController');

app.post('/api/meditek/v1/department/search', DepartmentController.postSearch);
app.post('/api/meditek/v1/department/add', DepartmentController.postAdd);
app.post('/api/meditek/v1/department/edit', DepartmentController.postEdit);
app.post('/api/meditek/v1/department/byId', DepartmentController.postById);

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


var mdtWaWorkCoverFirstController = require('./controllers/WaWorkCoverFirstController');

app.post('/api/meditek/v1/wa/workcover/first/add', mdtWaWorkCoverFirstController.postAdd);
app.post('/api/meditek/v1/wa/workcover/first/search', mdtWaWorkCoverFirstController.postSearch);
app.post('/api/meditek/v1/wa/workcover/first/edit', mdtWaWorkCoverFirstController.postEdit);

var mdtWaWorkCoverProgressController = require('./controllers/WaWorkCoverProgressController');

app.post('/api/meditek/v1/wa/workcover/progress/add', mdtWaWorkCoverProgressController.postAdd);
app.post('/api/meditek/v1/wa/workcover/progress/search', mdtWaWorkCoverProgressController.postSearch);
app.post('/api/meditek/v1/wa/workcover/progress/edit', mdtWaWorkCoverProgressController.postEdit);

var mdtWaWorkCoverFinalController = require('./controllers/WaWorkCoverFinalController');

app.post('/api/meditek/v1/wa/workcover/final/add', mdtWaWorkCoverFinalController.postAdd);
app.post('/api/meditek/v1/wa/workcover/final/search', mdtWaWorkCoverFinalController.postSearch);
app.post('/api/meditek/v1/wa/workcover/final/edit', mdtWaWorkCoverFinalController.postEdit);

var SysServicesController = require('./controllers/SysServicesController');

app.post('/api/meditek/v1/sysservices/search', SysServicesController.postSearch);
app.post('/api/meditek/v1/sysservices/add', SysServicesController.postAdd);
app.post('/api/meditek/v1/sysservices/edit', SysServicesController.postEdit);
app.post('/api/meditek/v1/sysservices/byId', SysServicesController.postById);

/*END AUTO CREATE*/

var mdtAutoController = require('./controllers/mdtAutoController');
app.get("/api/meditek/v1/auto/module", mdtAutoController.postModule);