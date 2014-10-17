/**
 * Created by meditech on 06/10/2014.
 */
var FunctionController = require('./controllers/FunctionController');

app.get('/api/function/list',FunctionController.list);
app.post('/api/function/edit',FunctionController.edit);
app.post('/api/function/insert',FunctionController.insert);
app.post('/api/function/delete',FunctionController.deleteFunction);
app.post('/api/function/id',FunctionController.findById);