var treeApprove = require("./controllers/treeApproveController/treeApproveController");
//LIST SYSTEM
app.post('/api/treeApprove/post-system-list', treeApprove.loadSystem);
app.post('/api/treeApprove/post-system-one', treeApprove.loadOneSystem);
app.post('/api/treeApprove/post-system-insert', treeApprove.insertSystem);
app.post('/api/treeApprove/post-system-delete', treeApprove.deleteSystem);
app.post('/api/treeApprove/post-system-update', treeApprove.updateSystem);
//END LIST SYSTEM

//LIST DEPARTMENT
app.post('/api/treeApprove/post-department-list', treeApprove.loadDepartment);
app.post('/api/treeApprove/post-department-insert', treeApprove.insertDepartment);
app.post('/api/treeApprove/post-department-one', treeApprove.loadOneDepartment);
app.post('/api/treeApprove/post-department-update', treeApprove.updateDepartment);
app.post('/api/treeApprove/post-department-delete', treeApprove.deleteDepartment);
//END LIST DEPARTMENT

//LIST TREEAPPROVE
app.post('/api/treeApprove/get-system-tree', treeApprove.loadTreeApprove);
app.post('/api/treeApprove/post-node-insert', treeApprove.insertNode);
app.get('/api/treeApprove/get-company-list', treeApprove.loadCompany);
app.get('/api/treeApprove/get-site-list', treeApprove.loadSite);
app.post('/api/treeApprove/post-node-one', treeApprove.loadOneNode);
app.post('/api/treeApprove/post-node-update', treeApprove.updateNode);
app.post('/api/treeApprove/post-node-delete', treeApprove.deleteNode);
//END LIST TREAPPROVE
