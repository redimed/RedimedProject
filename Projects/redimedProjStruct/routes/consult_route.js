/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var ConsultationController =  require('./controllers/ConsultationController');

app.post('/api/consultation/getPatientProblem',ConsultationController.getPatientProblem);