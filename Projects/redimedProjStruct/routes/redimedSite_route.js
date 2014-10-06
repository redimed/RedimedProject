/**
 * Created by meditech on 06/10/2014.
 */
var RedimedSiteController = require('./controllers/RedimedSiteController');

app.get('/api/redimedsite/list',RedimedSiteController.list);
app.post('/api/redimedsite/info',RedimedSiteController.siteInfo);
app.post('/api/redimedsite/insert',RedimedSiteController.insert);
app.post('/api/redimedsite/edit',RedimedSiteController.edit);