/** 
* Created by meditech on 23/09/2014. 
*/ 
var SysForms3Controller = require('./controllers/SysForms3Controller');

//////sys forms 2
app.get('/api/SysForms3/list',SysForms3Controller.list);
app.post('/api/SysForms3/findById',SysForms3Controller.findById);
app.post('/api/SysForms3/edit',SysForms3Controller.edit);
app.post('/api/SysForms3/insert',SysForms3Controller.insert);


