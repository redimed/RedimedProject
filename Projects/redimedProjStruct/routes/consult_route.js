/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var ConsultationController =  require('./controllers/ConsultationController');

app.post('/api/consultation/getPatientProblem',ConsultationController.getPatientProblem);
app.get('/api/consultation/draw/templates',ConsultationController.getDrawTemplate);
app.get('/api/consultation/draw/template/:id',ConsultationController.getTemplateImg);
app.post('/api/consultation/submit',ConsultationController.submitConsult);