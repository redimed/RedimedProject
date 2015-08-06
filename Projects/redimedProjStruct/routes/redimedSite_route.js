/**
 * Created by meditech on 06/10/2014.
 */
var RedimedSiteController = require('./controllers/RedimedSiteController');

app.get('/api/redimedsite/list',RedimedSiteController.list);
app.post('/api/redimedsite/info',RedimedSiteController.siteInfo);
app.post('/api/redimedsite/insert',RedimedSiteController.insert);

app.post('/api/redimedsite/edit',RedimedSiteController.edit);

app.post('/api/redimedsite/state',RedimedSiteController.stateBySite);
app.post('/api/redimedsite/state/id',RedimedSiteController.stateById);
app.post('/api/redimedsite/state/edit',RedimedSiteController.updateState);
app.post('/api/redimedsite/state/insert',RedimedSiteController.newState);

app.post('/api/redimedsite/state/suburb',RedimedSiteController.suburbByState);
app.post('/api/redimedsite/state/suburb/edit',RedimedSiteController.updateSuburb);
app.post('/api/redimedsite/state/suburb/id',RedimedSiteController.suburbById);
app.post('/api/redimedsite/state/suburb/insert',RedimedSiteController.newSuburb);

app.post('/api/redimedsite/room',RedimedSiteController.getRoomSite);
app.post('/api/redimedsite/room/details',RedimedSiteController.roomDetails);
app.post('/api/redimedsite/room/edit',RedimedSiteController.editRoom);
app.post('/api/redimedsite/room/available',RedimedSiteController.availableRooms);

