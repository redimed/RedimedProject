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
app.post('/api/im/upload',multipartMiddleware,injuryController.uploadInjuryPic);