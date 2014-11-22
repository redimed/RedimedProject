var v1_DoctorController = require('./controllers/v1_DoctorsController');
var v1_AppointmentController = require('./controllers/v1_AppointmentController');
var v1_InvItemsController = require('./controllers/v1_InvItemsController');
var v1_PatientController = require('./controllers/v1_PatientController');
var v1_UsersController = require('./controllers/v1_UsersController');
var v1_SystemController = require('./controllers/v1_SystemController');
var v1_WAFirstAssessmentController = require('./controllers/v1_WAFirstAssessmentController');
var v1_WAProgressAssessmentController = require('./controllers/v1_WAProgressAssessmentController');
var v1_WAFinalAssessmentController = require('./controllers/v1_WAFinalAssessmentController');

var v1_InventoryController = require('./controllers/v1_InventoryController');
var v1_Test = require('./controllers/v1_Test');

k_route.setRoute(app, v1_DoctorController, '/api/erm/v1/doctors/');
k_route.setRoute(app, v1_AppointmentController, '/api/erm/v1/appointment/');
k_route.setRoute(app, v1_InvItemsController, '/api/erm/v1/items/');
k_route.setRoute(app, v1_UsersController, '/api/erm/v1/users/');
k_route.setRoute(app, v1_PatientController, '/api/erm/v1/patients/');

k_route.setRoute(app, v1_SystemController, '/api/erm/v1/system/');
k_route.setRoute(app, v1_InventoryController, '/api/erm/v1/inv/');

k_route.setRoute(app, v1_WAFirstAssessmentController,'/api/erm/v1/wa/workcover/first/');
k_route.setRoute(app, v1_WAProgressAssessmentController,'/api/erm/v1/wa/workcover/progress/');
k_route.setRoute(app, v1_WAFinalAssessmentController,'/api/erm/v1/wa/workcover/final/');
k_route.setRoute(app, v1_Test, '/api/erm/v1/test/');

/*
*	VERSION 2
*/

var v2_ReferralsController = require('./controllers/v2_ReferralsController');
var v2_CompanyController = require('./controllers/v2_CompanyController');
var v2_InsurerController = require('./controllers/v2_InsurerController');

k_route.setRoute(app, v2_ReferralsController, '/api/erm/v2/referrals/');
k_route.setRoute(app, v2_CompanyController, '/api/erm/v2/companies/');
k_route.setRoute(app, v2_InsurerController, '/api/erm/v2/insurer/');