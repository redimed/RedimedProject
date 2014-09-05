/**
 * Created by meditech on 8/29/2014.
 */
var customers = require('./routes/customers');

//--------------------------------------------------
app.get('/api/customers', customers.list);
app.post('/api/customers/add', customers.add);
app.post('/api/customers/edit', customers.edit);