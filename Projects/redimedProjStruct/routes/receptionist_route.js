var ReceptionistController = require('./controllers/ReceptionistController');

app.post('/api/receptionist/appointment/getByDate',ReceptionistController.appointmentByDate);
app.post('/api/receptionist/appointment/progress',ReceptionistController.progressAppt);
app.get('/api/receptionist/getSites',ReceptionistController.getSites);
app.post('/api/receptionist/appointment/update',ReceptionistController.updateAppointment);