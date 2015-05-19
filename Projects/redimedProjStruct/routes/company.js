var CompanyController = require('./controllers/CompanyController');
var config = require('./config.js');

var url = config.defaultUrl+'company/';

app.post(url+'list', CompanyController.postList);
app.post(url+'add', CompanyController.postAdd);
app.post(url+'listParent', CompanyController.postListParent);
app.post(url+'listInsurer', CompanyController.postlistInsurer);
app.post(url +'byCompanyId',CompanyController.postbyCompanyId);
app.post(url + 'edit',CompanyController.postEdit);
app.post(url + 'remove',CompanyController.postRemove);
app.post(url + 'removeInsurer',CompanyController.postRemoveInsurer);
app.post(url + 'upCompanyPatient',CompanyController.postUpCompanyPatient);
app.post(url + 'disableInsurer',CompanyController.postDisableInsurer);
app.post(url + 'updateInsurer',CompanyController.postupdateInsurer);
app.post(url + 'disableCompany',CompanyController.postDisableCompany);
app.post(url + 'listNotFollow',CompanyController.postListNotFollow);
app.post(url + 'AddlistNotFollow',CompanyController.postAddlistNotFollow);
app.post(url + 'detail',CompanyController.postDetail);
app.post(url + 'addCompanyNotFollow',CompanyController.postaddCompanyNotFollow);