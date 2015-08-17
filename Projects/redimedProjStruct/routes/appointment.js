var AppointmentController = require('./controllers/AppointmentController');
var config = require('./config.js');

var url = config.defaultUrl+'appointment/';

//app.post(url+'byDoctor', AppointmentController.postByDoctor);
app.post(url+'load', AppointmentController.postLoad);
app.post(url+'alertCenterPatient', AppointmentController.alertCenterPatient);
app.post(url+'detailLoad', AppointmentController.postDetailLoad);
app.post(url+'add', AppointmentController.postAdd);
app.post(url+'edit',AppointmentController.postEdit);
app.post(url+'leaveCal',AppointmentController.postLeaveCal);
app.post(url+'one',AppointmentController.postOne);
app.post(url+'deleteClnAppPatient',AppointmentController.deleteClnAppPatient);
//tannv.dts@gmail.com
app.post(url+'beforePostLeaveCal',AppointmentController.beforePostLeaveCal);

//Vuong get alert center
app.post(url+'alertCenter', AppointmentController.alertCenter);
app.post(url+'alertCenterConsultation', AppointmentController.alertCenterConsultation);
app.post(url+'alertSiteCenter', AppointmentController.alertSiteCenter);
app.post(url+'getServiceColor', AppointmentController.getServiceColor);
app.post(url+'getOneApptPatient', AppointmentController.getOneApptPatient);
app.post(url+'changeService', AppointmentController.changeService);
app.post(url+'changeStatus', AppointmentController.changeStatus);
app.post(url+'postcheck', AppointmentController.postCheck);
app.post(url+'postuser', AppointmentController.postUser);
app.post(url+'postGetCal', AppointmentController.postGetCal);
