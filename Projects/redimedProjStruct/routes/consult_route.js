/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var ConsultationController =  require('./controllers/ConsultationController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.post('/api/consultation/getPatientProblem',ConsultationController.getPatientProblem);
app.get('/api/consultation/draw/templates',ConsultationController.getDrawTemplate);
app.get('/api/consultation/draw/template/:id',ConsultationController.getTemplateImg);
app.post('/api/consultation/submit',ConsultationController.submitConsult);
app.post('/api/consultation/draw/saveImage',ConsultationController.saveImage);
app.get('/api/consultation/draw/getImage/:id',ConsultationController.getImage);
app.post('/api/consultation/patient/company',ConsultationController.getPatientCompany);

app.post('/api/upload',multipartMiddleware,ConsultationController.uploadFile);
app.get('/api/download/:id',ConsultationController.downloadFile);
app.post('/api/consultation/byidConsult', ConsultationController.getByIdProblem);
//tannv.dts@gmail.com
//02-06-2015
app.post('/api/consultation/beforeStartSession',ConsultationController.beforeStartSession);
app.post('/api/consultation/startSession',ConsultationController.startSession);
app.post('/api/consultation/beforeFinishSession',ConsultationController.beforeFinishSession);
app.post('/api/consultation/finishSession',ConsultationController.finishSession);
app.post('/api/consultation/getApptPatient',ConsultationController.getApptPatient);
//
//phanquocchien.c1109g@gmail.com
//11-06-2015
app.post('/api/consultation/listconsultofpatient',ConsultationController.getListConsultOfPatient);

