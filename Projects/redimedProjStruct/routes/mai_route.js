/**
 * Created by meditech on 11/6/2014.
 */
var MaiController=require('./controllers/MaiController');

app.get('/api/mai/notification/list',MaiController.getListNotification);