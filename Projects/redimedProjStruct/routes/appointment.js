var AppointmentController = require('./controllers/AppointmentController');
var config = require('./config.js');

var url = config.defaultUrl+'appointment/';

//app.post(url+'byDoctor', AppointmentController.postByDoctor);
app.post(url+'load', AppointmentController.postLoad);
app.post(url+'add', AppointmentController.postAdd);
app.post(url+'leaveCal',AppointmentController.postLeaveCal);
//tannv.dts@gmail.com
app.post(url+'beforePostLeaveCal',AppointmentController.beforePostLeaveCal);

//Vuong get alert center
app.post(url+'alertCenter', AppointmentController.alertCenter);