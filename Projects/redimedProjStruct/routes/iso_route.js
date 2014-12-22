var isoController=require('./controllers/isoController/isoController');
var isoTreeDirController=require('./controllers/isoController/isoTreeDirController');
var isoCheckInOutController=require('./controllers/isoController/isoCheckInOutController');
var isoTreeUsersController=require('./controllers/isoController/isoTreeUsersController');
var isoNodeAncestorController=require('./controllers/isoController/isoNodeAncestorController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//isoController
app.get('/api/iso/core/get-user-name-list',isoController.getUserNameList);

//isoTreeDir
app.post('/api/iso/iso-tree-dir/get-tree-dir',isoTreeDirController.getTreeDir);
app.post('/api/iso/iso-tree-dir/create-folder',
	isoTreeDirController.createFolder,
	isoNodeAncestorController.setFolderAncestor,
	isoTreeUsersController.saveFolderAuthor);

app.post('/api/iso/iso-tree-dir/create-document-with-file',
	multipartMiddleware,
	isoTreeDirController.createDocumentWithFile,
	isoNodeAncestorController.setDocumentAncestor,
	isoTreeUsersController.saveDocumentAuthor,
	isoCheckInOutController.buildFirstCheckIn);

app.post('/api/iso/iso-tree-dir/check-dup-entry',isoTreeDirController.checkDupEntry);

//isoTreeUsersController
app.post('/api/iso/iso-tree-users/grant-node-permission',isoTreeUsersController.grantNodePermission);

//isoCheckInOutController
app.post('/api/iso/iso-check-out-in/check-out-document',isoCheckInOutController.checkOutDocument);
app.get('/api/iso/iso-check-out-in/download-check-out-document',isoCheckInOutController.downloadCheckOutDocument);
app.get('/api/iso/iso-check-out-in/can-check-in-document',isoCheckInOutController.canCheckInDocument);
app.post('/api/iso/iso-check-out-in/check-in-document',multipartMiddleware,isoCheckInOutController.checkInDocument);