/**
 * Created by meditech on 06/10/2014.
 */
var AssessmentController = require('./controllers/AssessmentController');

app.get('/api/assessment/header',AssessmentController.headerList);
app.post('/api/assessment/header/remove',AssessmentController.removeHeader);
app.post('/api/assessment/header/insert',AssessmentController.insertHeader);
app.get('/api/assessment',AssessmentController.getAssessment);
app.post('/api/assessment/remove',AssessmentController.removeAssessment);
app.post('/api/assessment/insert',AssessmentController.insertAssessment);