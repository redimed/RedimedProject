var InsurerController = require('./controllers/InsurerController');
var config = require('./config.js');

var url = config.defaultUrl+'insurer/';

app.post(url+'oneFollowPatient', InsurerController.postOneFollowPatient);
app.post(url+'oneFollowCompany', InsurerController.postOneFollowCompany);
app.post(url+'getByPatient',InsurerController.postGetByPatient);
app.post(url+'getFeeGroup',InsurerController.postGetFeeGroup);