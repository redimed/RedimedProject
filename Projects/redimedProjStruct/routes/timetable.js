var TimetableController = require('./controllers/TimetableController');
var config = require('./config.js');

var url = config.defaultUrl+'timetable/';
var site = config.defaultUrl+'redimedsite/';

app.post(url+'list', TimetableController.postList);
app.post(url+'one', TimetableController.postOne);
app.post(url+'edit', TimetableController.postEdit);
app.post(url+'siteList', TimetableController.postSiteList);
app.post(url+'add', TimetableController.postAdd);
app.post(url+'remove', TimetableController.postRemove);
app.post(url+'siteAdd', TimetableController.postSiteAdd);
app.post(url+'siteRemove', TimetableController.postSiteRemove);
app.post(url+'createTimetable', TimetableController.postCreateTimetable);

app.post(site+'list', TimetableController.postRedimedsiteList);