var isoTreeDirController=require('./controllers/isoController/isoTreeDirController');
var isoCheckInOutController=require('./controllers/isoController/isoCheckInOutController');
var isoTreeUsersController=require('./controllers/isoController/isoTreeUsersController');

app.post('/api/iso/iso-tree-dir/get-tree-dir',isoTreeDirController.getTreeDir);
app.post('/api/iso/iso-tree-dir/create-folder',isoTreeDirController.createFolder,isoTreeUsersController.saveFolderAuthor);

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/api/iso/iso-tree-dir/create-document-with-file',multipartMiddleware,isoTreeDirController.createDocumentWithFile,isoTreeUsersController.saveDocumentAuthor,isoCheckInOutController.buildFirstCheckIn);
app.post('/api/iso/iso-tree-dir/check-dup-entry',isoTreeDirController.checkDupEntry);

