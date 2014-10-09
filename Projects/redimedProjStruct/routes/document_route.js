/**
 * Created by meditech on 08/10/2014.
 */
var FAController = require('./controllers/DocumentController/FAController');
var MAController = require('./controllers/DocumentController/MAController');
var IDSController = require('./controllers/DocumentController/IDSController');
var UQController = require('./controllers/DocumentController/UQController');

app.get('/api/document/newFA',FAController.newFA);
app.get('/api/document/loadFA',FAController.loadFA);
app.get('/api/document/newMA',MAController.newMA);
app.get('/api/document/loadMA',MAController.loadMA);
app.get('/api/document/newIDS',IDSController.newIDS);
app.get('/api/document/loadIDS',IDSController.loadIDS);
app.post('/api/document/insertUQ',UQController.insertUQ);