var OutreferralController = require('./controllers/OutreferralController');
var config = require('./config.js');

var url = config.defaultUrl+'outreferral/';

app.post(url+'one', OutreferralController.postOne);
app.post(url+'listFollowPatient', OutreferralController.postListFollowPatient);
app.post(url+'listNoFollowPatient', OutreferralController.postListNoFollowPatient);
app.post(url+'addPatient', OutreferralController.postAddPatient);
app.post(url+'selectPatient', OutreferralController.postSelectPatient);
app.post(url+'edit', OutreferralController.postEdit);
app.post(url+'remove', OutreferralController.postRemove);
app.post(url + 'updateEnable',OutreferralController.postUpdateEnable)