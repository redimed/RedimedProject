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
app.post('/api/consultation/submit-measurements',ConsultationController.submitMeasurements);
app.post('/api/consultation/submit-medication',ConsultationController.submitMedication);
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
app.post('/api/consultation/check-consultation-patientID-calID',ConsultationController.checkConsultation);
app.post('/api/consultation/list-measurements',ConsultationController.getListMeasurements);
app.post('/api/consultation/list-medication',ConsultationController.getListMedication);
app.post('/api/consultation/set-isenable-measurements',ConsultationController.setIsEnableMeasurements);
app.post('/api/consultation/set-isenable-medication',ConsultationController.setIsEnableMedication);
app.post('/api/consultation/get-img-drawing-history',ConsultationController.getImgDrawingHistory);
app.post('/api/consultation/document-file-of-patientId-and-calId',ConsultationController.getDocumentFileOfPatientidAndCalid);
app.get('/api/consultation/drawing/image/:imageId',ConsultationController.drawingImageById);
app.post('/api/consultation/listCor',ConsultationController.postListCor);
app.post('/api/consultation/addCor',ConsultationController.postAddCor);
app.post('/api/consultation/byidCor',ConsultationController.postById);
//
//phanquocchien.c1109g@gmail.com
//11-06-2015
app.post('/api/consultation/listconsultofpatient',ConsultationController.getListConsultOfPatient);
app.post('/api/consultation/listconsultofpatientmobile',ConsultationController.getListConsultOfPatientMobile);
app.post('/api/consultation/detailhistoryanddrawing',ConsultationController.getdetailHistoryAndDrawing);

// manh
app.post('/api/consultation/listExercise',ConsultationController.listExercise);
app.post('/api/consultation/getOneExercise',ConsultationController.getOneExercise);
app.post('/api/consultation/updateExercise',ConsultationController.updateExercise);
app.post('/api/consultation/deleteExercise',ConsultationController.deleteExercise);
app.post('/api/consultation/addExercise',ConsultationController.addExercise);



