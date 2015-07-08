/**
 * Created by Luan Nguyen on 11/15/2014.
 */
var injuryController =  require('./controllers/InjuryManagementController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.post('/api/im/patients/search',injuryController.search);
app.post('/api/im/patients/getById',injuryController.getById);
app.post('/api/im/patients/checkMobile',injuryController.checkMobile);
app.post('/api/im/patients/checkEmail',injuryController.checkEmail);
app.post('/api/im/patients/getByUser',injuryController.patientByUser);
app.post('/api/im/patients/update',injuryController.updatePatient);
app.post('/api/im/submit',injuryController.submitInjury);
app.post('/api/im/edit',injuryController.editInjury);
app.post('/api/im/upload',multipartMiddleware,injuryController.uploadInjuryPic);
app.get('/api/im/list',injuryController.injuryList);
app.post('/api/im/listByPatient',injuryController.injuryListByPatient);
app.post('/api/im/searchByDate',injuryController.searchByDate);
app.post('/api/im/searchByDatePatient',injuryController.searchByDatePatient);
app.post('/api/im/getById',injuryController.injuryById);

app.post('/api/im/register',injuryController.register);

app.get('/api/im/getOnlineUsers',injuryController.getOnlineUsers);
app.post('/api/im/getInjuryByCompany',injuryController.getInjuryByCompany);

app.get('/api/im/getListDriver',injuryController.getListDriverOnline);
app.post('/api/im/allocateDriver',injuryController.allocateDriver);

app.get('/api/im/image/:imageId',injuryController.injuryImageById);
app.get('/api/sound/:type',function(req,res){
	var type = req.params.type;
	if(type == 'call')
    	res.sendfile('./sound/phone_calling.mp3');
    if(type == 'receive')
    	res.sendfile('./sound/receive_phone.wav');
    if(type == 'notification')
    	res.sendfile('./sound/notification.mp3');
})

app.get('/api/im/menu',injuryController.loadSideMenu);

app.post('/api/im/consultation', injuryController.getInjuryConsultation);
