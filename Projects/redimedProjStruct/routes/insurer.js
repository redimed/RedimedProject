var InsurerController = require('./controllers/InsurerController');
var config = require('./config.js');

var url = config.defaultUrl+'insurer/';

app.post(url+'oneFollowPatient', InsurerController.postOneFollowPatient);