var ClaimController = require('./controllers/ClaimController');
var config = require('./config.js');

var url = config.defaultUrl+'claim/';

app.post(url+'one', ClaimController.postOne);
app.post(url+'listFollowPatient', ClaimController.postListFollowPatient);
app.post(url+'listNoFollowPatient', ClaimController.postListNoFollowPatient);
app.post(url+'add', ClaimController.postAdd);
app.post(url+'edit', ClaimController.postEdit);
app.post(url+'remove', ClaimController.postRemove);