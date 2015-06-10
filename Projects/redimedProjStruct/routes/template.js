var TemplateController = require('./controllers/TemplateController');
var config = require('./config.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var url = config.defaultUrl+'template/';

app.post(url+'upload', multipartMiddleware, TemplateController.postUpload);
app.post(url+'add', TemplateController.postAdd);
app.post(url+'update', TemplateController.postEdit);
app.post(url+'list', TemplateController.postList);
app.post(url+'one', TemplateController.postOne);
app.post(url+'delete', TemplateController.postDelete);