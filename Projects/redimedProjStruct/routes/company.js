var CompanyController = require('./controllers/CompanyController');
var config = require('./config.js');

var url = config.defaultUrl+'company/';

app.get(url+'list', CompanyController.getList);
app.post(url+'add', CompanyController.postAdd);
app.post(url+'listParent', CompanyController.postListParent);
app.post(url+'listInsurer', CompanyController.postlistInsurer);
app.post(url +'byCompanyId',CompanyController.postbyCompanyId);