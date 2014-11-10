/**
 * Created by meditech on 06/10/2014.
 */
var CompanyController = require('./controllers/CompanyController');

app.get('/api/company/list',CompanyController.companyList);
app.post('/api/company/sub',CompanyController.subCompany);
app.post('/api/company/info',CompanyController.companyInfo);
app.post('/api/company/new',CompanyController.insert);
app.post('/api/company/edit',CompanyController.edit);