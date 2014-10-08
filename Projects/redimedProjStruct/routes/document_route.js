/**
 * Created by meditech on 08/10/2014.
 */
var DocumentController = require('./controllers/DocumentController');

app.get('/api/document/newFA',DocumentController.newFA);
app.get('/api/document/loadFA',DocumentController.loadFA);
app.get('/api/document/newMA',DocumentController.newMA);
app.get('/api/document/loadMA',DocumentController.loadMA);
app.get('/api/document/newIDS',DocumentController.newIDS);
app.get('/api/document/loadIDS',DocumentController.loadIDS);