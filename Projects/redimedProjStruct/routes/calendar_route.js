/**
 * Created by meditech on 06/10/2014.
 */
var CalendarController = require('./controllers/CalendarController');

app.get('/api/calendar/list',CalendarController.list);
app.post('/api/calendar/siteId',CalendarController.getBySite);
app.post('/api/calendar/info',CalendarController.getById);
app.post('/api/calendar/submit',CalendarController.submit);
