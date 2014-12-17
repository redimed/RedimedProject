var isoTreeDirController=require('./controllers/isoController/isoTreeDirController');
var isoCheckInOutController=require('./controllers/isoController/isoCheckInOutController');

app.get('/api/iso/iso-tree-dir/get-tree-dir',isoTreeDirController.getTreeDir);
app.post('/api/iso/iso-tree-dir/create-folder',isoTreeDirController.createFolder);

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/api/iso/iso-tree-dir/create-document-with-file',multipartMiddleware,isoTreeDirController.createDocumentWithFile,isoCheckInOutController.buildFirstCheckIn);
app.post('/api/iso/iso-tree-dir/check-dup-entry',isoTreeDirController.checkDupEntry);

