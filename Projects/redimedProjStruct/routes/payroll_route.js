var prController=require('./controllers/hrPayrollController/prController');
var prFornightlyTaxController=require('./controllers/hrPayrollController/prFornightlyTaxController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.get('/api/pr/core/test',prController.test);
app.get('/api/pr/fornightly-tax/test',prFornightlyTaxController.testReadExcel);
app.post('/api/pr/fornightly-tax/import-tax-list',multipartMiddleware,prFornightlyTaxController.importTaxList);