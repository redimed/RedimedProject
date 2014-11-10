/**
 * Created by meditech on 06/10/2014.
 */
var AssessmentController = require('./controllers/AssessmentController');

app.get('/api/assessment/header/list',AssessmentController.headerList);
app.post('/api/assessment/header/delete',AssessmentController.removeHeader);
app.post('/api/assessment/header/new',AssessmentController.insertHeader);
app.get('/api/assessment/list',AssessmentController.getAssessment);
app.post('/api/assessment/price',AssessmentController.assPrice);
app.post('/api/assessment/delete',AssessmentController.removeAssessment);
app.post('/api/assessment/new',AssessmentController.insertAssessment);
app.post('/api/assessment/edit',AssessmentController.editAssess);
app.post('/api/assessment/info',AssessmentController.infoAssessment);
