var ReceptionistController = require('./controllers/ReceptionistController');

app.post('/api/receptionist/appointment/upcoming',ReceptionistController.upcomingAppointment);