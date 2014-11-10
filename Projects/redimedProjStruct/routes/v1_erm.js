var v1_DoctorController = require('./controllers/v1_DoctorsController');
var v1_AppointmentController = require('./controllers/v1_AppointmentController');
var v1_InvItemsController = require('./controllers/v1_InvItemsController');
var v1_PatientController = require('./controllers/v1_PatientController');
var v1_UsersController = require('./controllers/v1_UsersController');
var v1_SystemController = require('./controllers/v1_SystemController');

var v1_InventoryController = require('./controllers/v1_InventoryController');


k_route.setRoute(app, v1_DoctorController, '/api/erm/v1/doctors/');
k_route.setRoute(app, v1_AppointmentController, '/api/erm/v1/appointment/');
k_route.setRoute(app, v1_InvItemsController, '/api/erm/v1/items/');
k_route.setRoute(app, v1_UsersController, '/api/erm/v1/users/');
k_route.setRoute(app, v1_PatientController, '/api/erm/v1/patients/');

k_route.setRoute(app, v1_SystemController, '/api/erm/v1/system/');
k_route.setRoute(app, v1_InventoryController, '/api/erm/v1/inv/');