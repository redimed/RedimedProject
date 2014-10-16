/** 
* Created by meditech on 23/09/2014. 
*/ 
var SysForms2Controller = require('./controllers/SysForms2Controller');

//////sys forms 2
app.get('/api/SysForms2/list',SysForms2Controller.list);
app.post('/api/SysForms2/findById',SysForms2Controller.findById);
app.post('/api/SysForms2/edit',SysForms2Controller.edit);
app.post('/api/SysForms2/insert',SysForms2Controller.insert);

var SysFormDetails2Controller = require('./controllers/SysFormDetails2Controller');

app.get('/api/SysForms2/listD',SysFormDetails2Controller.list);
app.post('/api/SysForms2/findByIdD',SysFormDetails2Controller.findById);
app.post('/api/SysForms2/findByMasterIdD',SysFormDetails2Controller.findByMasterId);
app.post('/api/SysForms2/editD',SysFormDetails2Controller.edit);
app.post('/api/SysForms2/insertD',SysFormDetails2Controller.insert);

app.post('/api/SysForms2/getSysForms2MASTER_SEQLOV',SysForms2Controller.getMASTER_SEQLOV);
