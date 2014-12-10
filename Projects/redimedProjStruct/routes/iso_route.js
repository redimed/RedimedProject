var isoTreeDirController=require('./controllers/isoController/isoTreeDirController');

app.get('/api/iso/iso-tree-dir/get-tree-dir',isoTreeDirController.getTreeDir);
app.post('/api/iso/iso-tree-dir/create-folder',isoTreeDirController.createFolder);
app.post('/api/iso/iso-tree-dir/create-document',isoTreeDirController.createDocument);