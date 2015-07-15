var AlertController = require('./controllers/AlertController');
var config = require('./config.js');

var url = config.defaultUrl+'alert/';

app.post(url+'one', AlertController.postOne);
app.post(url+'listFollowPatient', AlertController.postListFollowPatient);
app.post(url+'listNoFollowPatient', AlertController.postListNoFollowPatient);
app.post(url+'add', AlertController.postAdd);
app.post(url+'list', AlertController.postList);
app.post(url+'edit', AlertController.postEdit);
app.post(url+'remove', AlertController.postRemove);
app.post(url+'select', AlertController.postSelect);
app.post(url+'disableAlert',AlertController.postUpdateEnable);
app.post(url+'disablePatientAlert',AlertController.postUpdateEnablePatient);
app.post(url+'getMedication',AlertController.getMedication);
app.post(url+'insertMedication',AlertController.insertMedication);