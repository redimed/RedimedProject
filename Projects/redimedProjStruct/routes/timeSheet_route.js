var TimeSheetController = require('./controllers/TimeSheetController');

app.post('/api/staff/addAllTask',TimeSheetController.addAllTask);
app.post('/api/staff/editTask',TimeSheetController.editTask);
app.post('/api/staff/getAllTaskAMonth',TimeSheetController.getAllTaskAMonth);
app.get('/api/staff/getDepartmentLocation',TimeSheetController.getDepartmentLocation);
app.get('/api/staff/task/getList', TimeSheetController.getTaskList);