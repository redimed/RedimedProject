/**
 * Created by meditech on 08/09/2014.
 */
var functions = require('./routes/functions');

app.get('/api/function/list',functions.list);
app.post('/api/function/edit',functions.edit);
app.post('/api/function/insert',functions.insert);