var ClaimController = require('./controllers/ClaimController');
var config = require('./config.js');

var url = config.defaultUrl+'claim/';

app.get(url+'list', ClaimController.getList);