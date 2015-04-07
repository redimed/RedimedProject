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
app.get('/api/mobile/download/:id',ConsultationController.mobileDownloadFile);