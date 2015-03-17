var TimeSheetController = require('./controllers/TimeSheetController');

app.post('/api/staff/addAllTask',TimeSheetController.addAllTask);
app.post('/api/staff/editTask',TimeSheetController.editTask);
app.post('/api/staff/checkMonth',TimeSheetController.checkMonth);
app.post('/api/staff/getAllTaskAMonth',TimeSheetController.getAllTaskAMonth);
app.post('/api/staff/checkFirstTaskWeek',TimeSheetController.checkFirstTaskWeek);
app.post('/api/staff/checkTaskWeek',TimeSheetController.checkTaskWeek);
app.get('/api/staff/getDepartmentLocation',TimeSheetController.getDepartmentLocation);
app.get('/api/staff/task/getList', TimeSheetController.getTaskList);