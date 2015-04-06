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