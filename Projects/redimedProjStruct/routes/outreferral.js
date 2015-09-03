var OutreferralController = require('./controllers/OutreferralController');
var config = require('./config.js');

var url = config.defaultUrl+'outreferral/';

app.post(url+'one', OutreferralController.getOutReferralByid);
app.post(url+'listFollowPatient', OutreferralController.postListFollowPatient);
app.post(url+'listNoFollowPatient', OutreferralController.postListNoFollowPatient);
app.post(url+'checkReferral', OutreferralController.postCheckReferral);
app.post(url+'addPatient', OutreferralController.postAddOutSideReferral);
app.post(url+'selectPatient', OutreferralController.postAddPatientOutReferral);
app.post(url+'edit', OutreferralController.postEdit);
app.post(url+'remove', OutreferralController.postRemove);
app.post(url + 'updateEnable',OutreferralController.postUpdateEnable);
app.post(url+'checkPatientCalendar', OutreferralController.postCheckPatientCalendar);
app.post(url+'DotorFromUserId',OutreferralController.postDotorFromUserId);
app.post(url+'DotorFromDoctorId',OutreferralController.postDotorFromDoctorId)