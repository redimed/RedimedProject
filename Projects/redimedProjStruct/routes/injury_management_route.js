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
app.post('/api/im/submit',injuryController.submitInjury);
app.post('/api/im/edit',injuryController.editInjury);
app.post('/api/im/upload',multipartMiddleware,injuryController.uploadInjuryPic);
app.post('/api/im/deleteToken',injuryController.deleteToken);
app.get('/api/im/list',injuryController.injuryList);
app.post('/api/im/search',injuryController.searchInjury);
app.post('/api/im/getById',injuryController.injuryById);
app.post('/api/im/images',injuryController.injuryImageById);
app.get('/api/im/testGCM',injuryController.testPushGCM);
app.get('/api/im/getOnlineUsers',injuryController.getOnlineUsers);

app.get('/api/im/getListDriver',injuryController.getListDriver);
app.post('/api/im/allocateDriver',injuryController.allocateDriver);

app.get('/api/im/pushSound',function(req,res){
    res.sendfile('./sound/notification.mp3');
})