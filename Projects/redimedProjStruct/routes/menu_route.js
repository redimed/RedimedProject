/**
 * Created by meditech on 06/10/2014.
 */
var MenuController = require('./controllers/MenuController');

app.post('/api/menu/list/id',MenuController.list);
app.get('/api/menu/list/root',MenuController.listRoot);
app.post('/api/menu/edit',MenuController.edit);
app.post('/api/menu/insert',MenuController.insert);
app.post('/api/users/home',MenuController.loadSideMenu);
app.post('/api/menu/id',MenuController.findById);
app.post('/api/menu/delete',MenuController.remove);