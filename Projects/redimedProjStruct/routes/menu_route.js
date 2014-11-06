/**
 * Created by meditech on 06/10/2014.
 */
var MenuController = require('./controllers/MenuController');

app.get('/api/menu/list',MenuController.list);
app.post('/api/menu/edit',MenuController.edit);
app.post('/api/menu/insert',MenuController.insert);
app.post('/api/users/home',MenuController.loadSideMenu);
app.post('/api/menu/id',MenuController.findById);
app.get('/api/menu/listRoot',MenuController.listRoot);
app.post('/api/menu/delete',MenuController.remove);