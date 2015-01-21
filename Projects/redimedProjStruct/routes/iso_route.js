var isoController=require('./controllers/isoController/isoController');
var isoTreeDirController=require('./controllers/isoController/isoTreeDirController');
var isoCheckInOutController=require('./controllers/isoController/isoCheckInOutController');
var isoTreeUsersController=require('./controllers/isoController/isoTreeUsersController');
var isoNodeAncestorController=require('./controllers/isoController/isoNodeAncestorController');
var isoAdminController=require('./controllers/isoController/isoAdminController');
var isoUserGroupController=require('./controllers/isoController/isoUserGroupController');
var isoApproverController = require('./controllers/isoController/isoApproverController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//isoController
app.get('/api/iso/core/get-user-name-list',isoController.getUserNameList);
app.get('/api/iso/core/get-count-user-name',isoController.getCountUserName);

app.post('/api/iso/core/get-users-in-permission-group',isoController.getUsersInPermissionGroup);

//isoTreeDir
app.post('/api/iso/iso-tree-dir/get-tree-dir',isoTreeDirController.getTreeDir);
app.post('/api/iso/iso-tree-dir/create-folder',isoController.getUserPermission,isoTreeDirController.createFolder);
app.post('/api/iso/iso-tree-dir/delete-node',isoController.getUserPermission,isoTreeDirController.deleteNode);
app.post('/api/iso/iso-tree-dir/restore-node',isoController.getUserPermission,isoTreeDirController.restoreNode);
app.post('/api/iso/iso-tree-dir/handling-clone-folder',isoController.getUserPermission,isoTreeDirController.handlingCloneFolder);
app.get('/api/iso/iso-tree-dir/clone-folder',isoController.getUserPermission,isoTreeDirController.cloneFolder);
app.post('/api/iso/iso-tree-dir/getFullVersionDoccument',isoController.getUserPermission,isoTreeDirController.getFullVersionDoccument);
app.post('/api/iso/iso-tree-dir/getFullCheckinDoccument',isoController.getUserPermission,isoTreeDirController.getFullCheckinDoccument);
app.get('/api/iso/iso-tree-dir/handlingDownloadVersionDocument',isoController.getUserPermission,isoTreeDirController.handlingDownloadVersionDocument);



app.post('/api/iso/iso-tree-dir/create-document-with-file',
	multipartMiddleware,
	isoController.getUserPermission,
	isoTreeDirController.createDocumentWithFile,
	isoCheckInOutController.buildFirstCheckIn);

app.post('/api/iso/iso-tree-dir/check-dup-entry',isoTreeDirController.checkDupEntry);

//isoTreeUsersController
app.post('/api/iso/iso-tree-users/grant-node-permission',isoController.getUserPermission,isoTreeUsersController.grantNodePermission);
app.post('/api/iso/iso-tree-users/check-can-permission',isoController.getUserPermission,isoTreeUsersController.checkCanPermission);
app.post('/api/iso/iso-tree-users/grant-user-group-permission',isoController.getUserPermission,isoTreeUsersController.grantUserGroupPermission);
app.post('/api/iso/iso-tree-users/grant-permission-for-new-user-in-group',isoController.checkAdminIsoSystem,isoTreeUsersController.grantPermissionForNewUserInGroup);

//isoCheckInOutController
app.post('/api/iso/iso-check-out-in/check-out-document',isoController.getUserPermission,isoCheckInOutController.checkOutDocument);
app.get('/api/iso/iso-check-out-in/download-check-out-document',isoController.getUserPermission,isoCheckInOutController.downloadCheckOutDocument);
app.get('/api/iso/iso-check-out-in/can-check-in-document',isoController.getUserPermission,isoCheckInOutController.canCheckInDocument);
app.post('/api/iso/iso-check-out-in/check-in-document',multipartMiddleware,isoController.getUserPermission,isoCheckInOutController.checkInDocument);
app.post('/api/iso/iso-check-out-in/submitDocument',isoCheckInOutController.submitDocument);
app.post('/api/iso/iso-check-out-in/approvedAndReject',isoCheckInOutController.approvedAndReject);
app.get('/api/iso/iso-check-out-in/selectIdFromCheckOutIn',isoCheckInOutController.selectIdFromCheckOutIn);
app.get('/api/iso/iso-check-out-in/downloadNewestVersionDocument',isoController.getUserPermission,isoCheckInOutController.downloadNewestVersionDocument);
//tannv.dts@gmail.com
app.post('/api/iso/iso-check-out-in/submit-document',isoController.getUserPermission,isoCheckInOutController.checkCanSubmitDocument,isoCheckInOutController.submitDocument);
app.post('/api/iso/iso-check-out-in/cancel-submit-document',isoController.getUserPermission,isoCheckInOutController.checkCanCancelSubmitDocument,isoCheckInOutController.cancelSubmitDocument);
app.get('/api/iso/iso-check-out-in/access-approval-page',isoCheckInOutController.checkIsApprover,isoCheckInOutController.accessApprovalPage);

app.get('/api/iso/iso-check-out-in/countOutInStatusPending',isoCheckInOutController.checkIsApprover,isoCheckInOutController.countOutInStatusPending);
app.get('/api/iso/iso-check-out-in/getAllOutInStatusPending',isoCheckInOutController.checkIsApprover,isoCheckInOutController.getAllOutInStatusPending);
app.get('/api/iso/iso-check-out-in/downloadFileCheckOutIn',isoCheckInOutController.checkIsApprover,isoCheckInOutController.downloadFileCheckOutIn);
app.post('/api/iso/iso-check-out-in/approved-document',isoCheckInOutController.checkIsApprover,isoCheckInOutController.approvedDocument);
app.post('/api/iso/iso-check-out-in/rejected-document',isoCheckInOutController.checkIsApprover,isoCheckInOutController.rejectedDocument);
//isoAdminController
app.post('/api/iso/iso-admin/check-iso-admin',isoAdminController.checkIsoAdmin);
app.get('/api/iso/iso-admin/getAdminList',isoAdminController.getAdminList);
app.post('/api/iso/iso-admin/insertNewUserToAdmin',isoController.checkAdminIsoSystemMaster,isoAdminController.insertNewUserToAdmin);
app.post('/api/iso/iso-admin/updateEnableAdmin',isoController.checkAdminIsoSystemMaster,isoAdminController.updateEnableAdmin);

//isoUserGroupController
app.get('/api/iso/iso-user-group/access-user-group-page',isoController.checkAdminIsoSystem,isoUserGroupController.accessUserGroupPage);
app.get('/api/iso/iso-user-group/get-user-group-list',isoController.checkAdminIsoSystem,isoUserGroupController.getUserGroupList);
app.post('/api/iso/iso-user-group/update-group-info',isoController.checkAdminIsoSystem,isoUserGroupController.updateGroupInfo);
app.post('/api/iso/iso-user-group/add-group',isoController.checkAdminIsoSystem,isoUserGroupController.addGroup);
app.post('/api/iso/iso-user-group/get-user-in-group',isoController.checkAdminIsoSystem,isoUserGroupController.getUsersInGroup);
app.post('/api/iso/iso-user-group/update-group-item-info',isoController.checkAdminIsoSystem,isoUserGroupController.updateGroupItemInfo);
app.post('/api/iso/iso-user-group/add-group-item',isoController.checkAdminIsoSystem,isoUserGroupController.addGroupItem);

//iso Approver 
app.get('/api/iso/iso-approver/getApproverList',isoApproverController.getApproverList);
app.post('/api/iso/iso-approver/insertNewUserToApprover',isoController.checkAdminIsoSystem,isoApproverController.insertNewUserToApprover);
app.post('/api/iso/iso-approver/updateEnableApprover',isoController.checkAdminIsoSystem,isoApproverController.updateEnableApprover);

