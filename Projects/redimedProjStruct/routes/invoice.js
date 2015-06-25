var InvoiceController = require('./controllers/InvoiceController');
var config = require('./config.js');

var url = config.defaultUrl+'invoice/';

app.post('/api/invoice/vn/get-invoice-header',InvoiceController.getInvoiceHeader);
app.post('/api/invoice/vn/get-invoice-list-lines',InvoiceController.getInvoiceListLines);