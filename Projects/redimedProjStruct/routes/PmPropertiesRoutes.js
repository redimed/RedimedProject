/** 
* Created by meditech on 23/09/2014. 
*/
var PmPropertiesController = require('./controllers/PmPropertiesController');

//////sys forms 2
app.get('/api/PmProperties/list',PmPropertiesController.list);
app.post('/api/PmProperties/findById',PmPropertiesController.findById);
app.post('/api/PmProperties/edit',PmPropertiesController.edit);
app.post('/api/PmProperties/insert',PmPropertiesController.insert);

