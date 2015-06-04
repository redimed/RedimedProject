var ReceptionistController = require('./controllers/ReceptionistController');

app.post('/api/receptionist/appointment/getByDate',ReceptionistController.appointmentByDate);
app.get('/api/receptionist/getSites',ReceptionistController.getSites);
app.post('/api/receptionist/appointment/update',ReceptionistController.updateAppointment);