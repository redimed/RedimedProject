/**
 * Created by meditech on 09/09/2014.
 */
var menus = require('./routes/menus');

app.get('/api/menu/list',menus.list);
app.post('/api/menu/edit',menus.edit);
app.post('/api/menu/insert',menus.insert);
app.post('/api/menu/editChild',menus.editChild);
app.post('/api/menu/insertChild',menus.insertChild);