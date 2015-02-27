var isoController=require('./controllers/isoController/isoController');
var isoTreeDirController=require('./controllers/isoController/isoTreeDirController');
var isoCheckInOutController=require('./controllers/isoController/isoCheckInOutController');
var isoTreeUsersController=require('./controllers/isoController/isoTreeUsersController');
var isoNodeAncestorController=require('./controllers/isoController/isoNodeAncestorController');
var isoAdminController=require('./controllers/isoController/isoAdminController');
var isoUserGroupController=require('./controllers/isoController/isoUserGroupController');
var isoApproverController = require('./controllers/isoController/isoApproverController');
var isoHierarchyApprovalController = require('./controllers/isoController/isoHierarchyApprovalController');
var isoRequestEditDocumentController = require('./controllers/isoController/isoRequestEditDocumentController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//isoController
app.get('/api/iso/core/get-user-name-list',isoController.getUserNameList);
app.get('/api/iso/core/get-count-user-name',isoController.getCountUserName);
app.post('/api/iso/core/get-users-in-permission-group',isoController.getUsersInPermissionGroup);
app.get('/api/iso/core/get-new-key',isoController.getNewKey);
app.get('/api/iso/core/get-department-list',isoController.getDepartmentList);
//app.get('/api/iso/iso-check-out-in/check-is-hierarchy-iso-approver',isoCheckInOutController.checkHierarchyIsoApprover);


//isoTreeDir
app.post('/api/iso/iso-tree-dir/get-tree-dir',isoTreeDirController.getTreeDir);
app.post('/api/iso/iso-tree-dir/create-folder',isoController.getUserPermission,isoTreeDirController.createFolder);
app.post('/api/iso/iso-tree-dir/delete-node',isoController.getUserPermission,isoTreeDirController.deleteNode);
app.post('/api/iso/iso-tree-dir/restore-node',isoController.checkAdminIsoSystem,isoTreeDirController.restoreNode);
app.post('/api/iso/iso-tree-dir/handling-clone-folder',isoController.getUserPermission,isoTreeDirController.handlingCloneFolder);
app.get('/api/iso/iso-tree-dir/clone-folder',isoController.getUserPermission,isoTreeDirController.cloneFolder);
app.post('/api/iso/iso-tree-dir/getFullVersionDoccument',isoController.getUserPermission,isoTreeDirController.getFullVersionDoccument);
app.post('/api/iso/iso-tree-dir/getFullCheckinDoccument',isoController.getUserPermission,isoTreeDirController.getFullCheckinDoccument);
app.get('/api/iso/iso-tree-dir/handlingDownloadVersionDocument',isoController.getUserPermission,isoTreeDirController.handlingDownloadVersionDocument);
app.post('/api/iso/iso-tree-dir/select-document-info',isoTreeDirController.selectDocumentInfo);



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
app.post('/api/iso/iso-tree-users/grant-permission-for-user-in-group',isoController.checkAdminIsoSystem,isoTreeUsersController.grantPermissionForUserInGroup);
app.post('/api/iso/iso-tree-users/remove-all-permission-of-user-of-group',isoController.checkAdminIsoSystem,isoTreeUsersController.removeAllPermissionOfUserInGroup);
app.post('/api/iso/iso-tree-users/disable-permission-of-group',isoController.checkAdminIsoSystem,isoTreeUsersController.disablePermissionOfGroup);
app.post('/api/iso/iso-tree-users/enable-permission-of-group',isoController.checkAdminIsoSystem,isoTreeUsersController.enablePermissionOfGroup);

//isoCheckInOutController
app.post('/api/iso/iso-check-out-in/check-out-document',isoController.getUserPermission,isoCheckInOutController.checkOutDocument);
app.get('/api/iso/iso-check-out-in/download-check-out-document',isoController.getUserPermission,isoCheckInOutController.downloadCheckOutDocument);
app.get('/api/iso/iso-check-out-in/can-check-in-document',isoController.getUserPermission,isoCheckInOutController.canCheckInDocument);
app.post('/api/iso/iso-check-out-in/check-in-document',multipartMiddleware,isoController.getUserPermission,isoCheckInOutController.checkInDocument);
app.post('/api/iso/iso-check-out-in/submitDocument',isoCheckInOutController.submitDocument);
app.post('/api/iso/iso-check-out-in/approvedAndReject',isoCheckInOutController.approvedAndReject);
app.get('/api/iso/iso-check-out-in/selectIdFromCheckOutIn',isoCheckInOutController.selectIdFromCheckOutIn);
app.get('/api/iso/iso-check-out-in/downloadNewestVersionDocument',isoController.getUserPermission,isoCheckInOutController.downloadNewestVersionDocument);
app.post('/api/iso/iso-check-out-in/send-email-all-user-document-release',isoCheckInOutController.sendEmailAllUserDocumentRelease);
//tannv.dts@gmail.com
app.post('/api/iso/iso-check-out-in/submit-document',isoController.getUserPermission,isoCheckInOutController.checkCanSubmitDocument,isoCheckInOutController.submitDocument);
app.post('/api/iso/iso-check-out-in/cancel-submit-document',isoController.getUserPermission,isoCheckInOutController.checkCanCancelSubmitDocument,isoCheckInOutController.cancelSubmitDocument);
app.get('/api/iso/iso-check-out-in/access-approval-page',isoCheckInOutController.checkIsApprover,isoCheckInOutController.accessApprovalPage);
app.get('/api/iso/iso-check-out-in/countOutInStatusPending',isoCheckInOutController.checkIsApprover,isoCheckInOutController.countOutInStatusPending);
app.get('/api/iso/iso-check-out-in/getAllOutInStatusPending',isoCheckInOutController.checkIsApprover,isoCheckInOutController.getAllOutInStatusPending);
app.get('/api/iso/iso-check-out-in/downloadFileCheckOutIn',isoCheckInOutController.checkIsApprover,isoCheckInOutController.downloadFileCheckOutIn);
//app.post('/api/iso/iso-check-out-in/approved-document',isoCheckInOutController.checkIsApprover,isoCheckInOutController.approvedDocument);
app.post('/api/iso/iso-check-out-in/approved-document',isoController.checkAdminTree,isoCheckInOutController.approvedDocument);
app.post('/api/iso/iso-check-out-in/rejected-document',isoCheckInOutController.checkIsApprover,isoCheckInOutController.rejectedDocument);
app.post('/api/iso/iso-check-out-in/make-current-version',isoController.checkAdminTree,isoCheckInOutController.makeCurrentVersion);

//isoAdminController
app.post('/api/iso/iso-admin/check-is-admin-iso-system',isoController.checkAdminIsoSystem,isoAdminController.checkIsAdminIsoSystem);
app.post('/api/iso/iso-admin/check-is-admin-iso-system-master',isoController.checkAdminIsoSystemMaster,isoAdminController.checkIsAdminIsoSystemMaster);
app.get('/api/iso/iso-admin/getAdminList',isoAdminController.getAdminList);
app.post('/api/iso/iso-admin/insertNewUserToAdmin',isoController.checkAdminIsoSystemMaster,isoAdminController.insertNewUserToAdmin);
app.post('/api/iso/iso-admin/updateEnableAdmin',isoController.checkAdminIsoSystemMaster,isoAdminController.updateEnableAdmin);
app.post('/api/iso/iso-admin/deleteAdmin',isoController.checkAdminIsoSystemMaster,isoAdminController.deleteAdmin);

//isoUserGroupController
app.get('/api/iso/iso-user-group/access-user-group-page',isoController.checkAdminIsoSystem,isoUserGroupController.accessUserGroupPage);
// app.get('/api/iso/iso-user-group/get-user-group-list',isoController.checkAdminIsoSystem,isoUserGroupController.getUserGroupList);
app.get('/api/iso/iso-user-group/get-user-group-list',isoUserGroupController.getUserGroupList);
app.post('/api/iso/iso-user-group/update-group-info',isoController.checkAdminIsoSystem,isoUserGroupController.updateGroupInfo);
app.post('/api/iso/iso-user-group/add-group',isoController.checkAdminIsoSystem,isoUserGroupController.addGroup);
app.post('/api/iso/iso-user-group/get-user-in-group',isoController.checkAdminIsoSystem,isoUserGroupController.getUsersInGroup);
app.post('/api/iso/iso-user-group/update-group-item-info',isoController.checkAdminIsoSystem,isoUserGroupController.updateGroupItemInfo);
app.post('/api/iso/iso-user-group/add-group-item',isoController.checkAdminIsoSystem,isoUserGroupController.addGroupItem);
app.post('/api/iso/iso-user-group/delete-group-item',isoController.checkAdminIsoSystem,isoUserGroupController.deleteGroupItem);

//iso Approver 
app.get('/api/iso/iso-approver/getApproverList',isoApproverController.getApproverList);
app.post('/api/iso/iso-approver/insertNewUserToApprover',isoController.checkAdminIsoSystem,isoApproverController.insertNewUserToApprover);
app.post('/api/iso/iso-approver/updateEnableApprover',isoController.checkAdminIsoSystem,isoApproverController.updateEnableApprover);
app.get('/api/iso/iso-approver/check-is-iso-approver',isoController.checkIsoApprover,isoApproverController.checkIsIsoApprover);

//isoHierarchyApprovalController
app.post('/api/iso/iso-hierarchy-approval/add-hierarchy-approval-header',isoController.checkHierarchyIsoApprover,isoHierarchyApprovalController.checkCanSubmitDocument,isoHierarchyApprovalController.submitDocument,isoHierarchyApprovalController.addHierarchyApprovalHeader);
app.post('/api/iso/iso-hierarchy-approval/approval',isoHierarchyApprovalController.approval);
app.get('/api/iso/iso-hierarchy-approval/get-all-hierarchy-line-for-user',isoController.checkHierarchyIsoApprover,isoHierarchyApprovalController.getAllHierarchyLineForUser);
app.get('/api/iso/iso-hierarchy-approval/download-file-check-out-in',isoController.checkHierarchyIsoApprover,isoHierarchyApprovalController.downloadFileCheckOutIn);
app.post('/api/iso/iso-hierarchy-approval/send-email-notification-approval-to-next-node',isoHierarchyApprovalController.sendEmailNotificationApprovalToNextNode);

//isoRequestEditDocumentController
app.post('/api/iso/iso-tree-dir/send-request-to-edit-document',isoRequestEditDocumentController.requestEditDocument);
app.post('/api/iso/iso-request-edit-document/get-all-request-of-user-login',isoRequestEditDocumentController.getAllRequestOfUserLogin);
app.post('/api/iso/iso-request-edit-document/cancel-request',isoRequestEditDocumentController.cancelRequest);
app.post('/api/iso/iso-request-edit-document/get-all-request',isoRequestEditDocumentController.getAllRequest);
app.post('/api/iso/iso-request-edit-document/set-request-is-read',isoRequestEditDocumentController.setRequestIsRead);
app.post('/api/iso/iso-request-edit-document/set-request-star',isoRequestEditDocumentController.setRequestStar);

//FUNCTION FOR ADMIN SYSTEM
// app.post('/api/iso/iso-check-out-in/force-check-in-document',multipartMiddleware,isoController.getUserPermission,isoCheckInOutController.checkInDocument);
app.post('/api/iso/iso-check-out-in/force-submit-document',isoController.checkAdminIsoSystem,isoCheckInOutController.forceSubmitDocument,isoCheckInOutController.submitDocument);
app.post('/api/iso/iso-check-out-in/force-approved-document',isoController.checkAdminIsoSystem,isoCheckInOutController.approvedDocument);