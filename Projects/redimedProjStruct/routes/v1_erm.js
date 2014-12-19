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
/// var v1_Test = require('./controllers/v1_Test');

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
/// k_route.setRoute(app, v1_Test, '/api/erm/v1/test/');

/*
*	VERSION 2
*/
var v2_CompanyController = require('./controllers/v2_CompanyController');
var v2_InsurersController = require('./controllers/v2_InsurersController');
var v2_ClientController = require('./controllers/v2_ClientController');
var v2_DepartmentController = require('./controllers/v2_DepartmentController');
var v2_AppointmentController = require('./controllers/v2_AppointmentController');
var v2_DoctorController = require('./controllers/v2_DoctorController');
var v2_ItemController = require('./controllers/v2_ItemController');
var v2_ItemFeeController = require('./controllers/v2_ItemFeeController');
var v2_ItemFeeGroupController = require('./controllers/v2_ItemFeeGroupController');
var v2_ItemFeeTypesController = require('./controllers/v2_ItemFeeTypesController');
var v2_ItemPrivateFundsController = require('./controllers/v2_ItemPrivateFundsController');

k_route.setRoute(app, v2_CompanyController, '/api/erm/v2/companies/');
k_route.setRoute(app, v2_InsurersController, '/api/erm/v2/insurers/');
k_route.setRoute(app, v2_ClientController, '/api/erm/v2/patients/');
k_route.setRoute(app, v2_DepartmentController, '/api/erm/v2/dept/');
k_route.setRoute(app, v2_AppointmentController, '/api/erm/v2/appt/');
k_route.setRoute(app, v2_DoctorController, '/api/erm/v2/doctor/');
k_route.setRoute(app, v2_ItemController, '/api/erm/v2/items/');
k_route.setRoute(app, v2_ItemFeeController, '/api/erm/v2/fees/');
k_route.setRoute(app, v2_ItemFeeGroupController, '/api/erm/v2/fees/group/');
k_route.setRoute(app, v2_ItemFeeTypesController, '/api/erm/v2/fees/type/');
k_route.setRoute(app, v2_ItemPrivateFundsController, '/api/erm/v2/fees/funds/')