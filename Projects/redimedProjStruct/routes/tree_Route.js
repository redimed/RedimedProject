var TreeApprove = require("./controllers/TreeApproveController/TreeApproveController");
//ROUTE FUNCTION
app.post('/api/treeApprove/post-function-list', TreeApprove.LoadFunction);
app.post('/api/treeApprove/post-function-one', TreeApprove.LoadOneFunction);
app.post('/api/treeApprove/post-function-insert', TreeApprove.InsertFunction);
app.post('/api/treeApprove/post-function-delete', TreeApprove.DeleteFunction);
app.post('/api/treeApprove/post-function-update', TreeApprove.UpdateFunction);
//END ROUTE FUNCTION

//ROUTE TREE
app.post('/api/treeApprove/post-tree-list', TreeApprove.LoadTree);
app.post('/api/treeApprove/post-tree-insert', TreeApprove.InsertTree);
app.post('/api/treeApprove/post-tree-one', TreeApprove.LoadOneTree);
app.post('/api/treeApprove/post-tree-update', TreeApprove.UpdateTree);
app.post('/api/treeApprove/post-tree-delete', TreeApprove.DeleteTree);
//END ROUTE TREE

//ROUTE TREE DETAIL
app.post('/api/treeApprove/get-function-tree', TreeApprove.LoadTreeApprove);
app.post('/api/treeApprove/post-node-insert', TreeApprove.InsertNode);
app.get('/api/treeApprove/get-company-list', TreeApprove.LoadCompany);
app.get('/api/treeApprove/get-site-list', TreeApprove.LoadSite);
app.post('/api/treeApprove/post-node-one', TreeApprove.LoadOneNode);
app.post('/api/treeApprove/post-node-update', TreeApprove.UpdateNode);
app.post('/api/treeApprove/post-node-delete', TreeApprove.DeleteNode);
//END ROUTE TREE DETAIL
