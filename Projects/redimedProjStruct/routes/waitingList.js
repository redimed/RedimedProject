var WaitingListController = require('./controllers/WaitingListController');
var config = require('./config.js');

var url = config.defaultUrl+'waitingList/';

app.post(url+'add', WaitingListController.postAdd);
app.post(url+'list', WaitingListController.postList);
app.post(url+'remove', WaitingListController.postRemove);