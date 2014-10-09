/**
 * Created by meditech on 08/10/2014.
 */
var FAController = require('./controllers/DocumentController/FAController');
var MAController = require('./controllers/DocumentController/MAController');
var IDSController = require('./controllers/DocumentController/IDSController');
var MHController = require('./controllers/DocumentController/MHController');
var MRSController = require('./controllers/DocumentController/MRSController');
var AUD1Controller = require('./controllers/DocumentController/AUD1Controller');
var AUD2Controller = require('./controllers/DocumentController/AUD2Controller');

app.get('/api/document/newFA',FAController.newFA);
app.get('/api/document/loadFA',FAController.loadFA);
app.get('/api/document/newMA',MAController.newMA);
app.get('/api/document/loadMA',MAController.loadMA);
app.get('/api/document/newIDS',IDSController.newIDS);
app.get('/api/document/loadIDS',IDSController.loadIDS);
app.get('/api/document/newMH',MHController.newMH);
app.get('/api/document/loadMH',MHController.loadMH);
app.get('/api/document/newMRS',MRSController.newMRS);
app.get('/api/document/loadMRS',MRSController.loadMRS);
app.get('/api/document/newAUD1',AUD1Controller.newAUD1);
app.get('/api/document/loadAUD1',AUD1Controller.loadAUD1);
app.get('/api/document/newAUD2',AUD2Controller.newAUD2);
app.get('/api/document/loadAUD2',AUD2Controller.loadAUD2);
