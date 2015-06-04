// EXPORTS MODULE
var adminController = require("./controllers/TimeSheetController/adminController");
var downloadController = require("./controllers/TimeSheetController/downloadController");
var functionForTimesheet = require("./controllers/TimeSheetController/functionForTimesheet");
var manageLeaveController = require("./controllers/TimeSheetController/manageLeaveController");
var manageTimesheetController = require("./controllers/TimeSheetController/manageTimesheetController");
var staffLeaveController = require("./controllers/TimeSheetController/staffLeaveController");
var staffTimesheetController = require("./controllers/TimeSheetController/staffTimesheetController");
var uploadController = require("./controllers/TimeSheetController/uploadController");
var checkRoleController = require("./controllers/TimeSheetController/checkRoleController");
var reportController = require("./controllers/TimeSheetController/reportController");
var staffTimesheetController = require('./controllers/TimeSheetController/staffTimesheetController');
var multipartMiddleware = multipart();
//END EXPORTS MODULE

//TIMESHEET FOR ADMIN
app.post("/api/TimeSheet/post-list-tree", adminController.LoadTreeTimeSheet);
app.post("/api/TimeSheet/post-list-node", adminController.LoadNodeTimeSheet);
app.post("/api/TimeSheet/post-list-user", adminController.LoadUserTimeSheet);
app.get("/api/TimeSheet/post-select-user", adminController.LoadSelectUser);
app.post("/api/TimeSheet/post-delete-user", adminController.DeleteUser);
app.get("/api/TimeSheet/get-list-department", adminController.LoadDepartMent);
app.post("/api/TimeSheet/post-node-select", adminController.LoadNodeSelect);
app.post("/api/TimeSheet/post-user-list", adminController.LoadUser);
app.post("/api/TimeSheet/post-user-add", adminController.AddUser);
app.post("/api/TimeSheet/post-user-one", adminController.LoadOneUser);
app.post("/api/TimeSheet/post-user-update", adminController.UpdateUser);
app.post("/api/TimeSheet/post-role-where", adminController.LoadRoleWhere);
app.post("/api/TimeSheet/post-dept-where", adminController.LoadDeptWhere);
app.post("/api/TimeSheet/post-dept-list", adminController.LoadDept);
app.post("/api/TimeSheet/post-dept-del", adminController.DeleteDept);
app.get("/api/TimeSheet/get-location-list", adminController.LoadLocation);
app.post("/api/TimeSheet/post-dept-one", adminController.LoadOneDept);
app.post("/api/TimeSheet/post-dept-insert", adminController.InsertDept);
app.post("/api/TimeSheet/post-dept-update", adminController.UpdateDept);
app.post("/api/TimeSheet/post-list-emp", adminController.StepEmployee);
//END TIMESHEET FR ADMIN


//TIMESHEET FOR MANAGE
app.post("/api/TimeSheet/post-one-approved", manageTimesheetController.ViewApproved);
app.post("/api/TimeSheet/post-detail-one", manageTimesheetController.ViewOnDate);
app.post("/api/TimeSheet/post-list-approve", manageTimesheetController.LoadTimeSheetApprove);
app.post("/api/TimeSheet/post-reject-taskweek", manageTimesheetController.RejectTaskWeek);
app.post("/api/TimeSheet/post-approve-taskweek", manageTimesheetController.ApproveTaskWeek);
//END TIMESHEET FOR MANAGE

//CHECK ROLE ON TIMESHEET
app.post("/api/TimeSheet/post-role-one", checkRoleController.LoadRole);
//END CHECK ROLE ON TIMESHEET

//UPLOAD FILE TIMESHEET
app.post("/api/TimeSheet/post-upload-file", multipartMiddleware, uploadController.UploadFile);
app.post("/api/TimeSheet/post-del-file", uploadController.DeleteFile);
//END UPLOAD FILE TIMESHEET

//DOWNLOAD FILE TIMESHEET
app.get("/api/TimeSheet/get-download-file/:id", downloadController.DownloadFile);
//END DOWNLOAD FILE


//TIMESHEET FOR STAFF
app.post('/api/staff/addAllTask', staffTimesheetController.addAllTask);
app.post('/api/staff/editTask', staffTimesheetController.editTask);
app.post('/api/staff/getTask', staffTimesheetController.getTask);
app.post('/api/staff/showDetailDate', staffTimesheetController.showDetailDate);
app.post('/api/staff/checkMonth', staffTimesheetController.checkMonth);
app.post('/api/staff/getAllTaskAMonth', staffTimesheetController.getAllTaskAMonth);
app.post('/api/staff/checkFirstTaskWeek', staffTimesheetController.checkFirstTaskWeek);
app.post('/api/staff/checkTaskWeek', staffTimesheetController.checkTaskWeek);
app.post('/api/staff/showEdit', staffTimesheetController.showEdit);
app.get('/api/staff/getDepartmentLocation', staffTimesheetController.getDepartmentLocation);
app.get('/api/staff/task/getList', staffTimesheetController.getTaskList);
app.post('/api/staff/items', staffTimesheetController.getItemList);
app.post("/api/staff/get-contract", staffTimesheetController.LoadContract);
app.post("/api/staff/SubmitOnView", staffTimesheetController.SubmitOnView);
app.post("/api/staff/checktime", staffTimesheetController.CheckTimeInLieu);
app.post("/api/TimeSheet/post-itemcode-list", staffTimesheetController.LoadItemCode);
//END TIMESHEET FOR STAFF

//LEAVE FORM FOR STAFF
app.post("/api/TimeSheet/post-info-employee", staffLeaveController.LoadInfoEmployee);
app.post("/api/TimeSheet/post-leave-form", staffLeaveController.UpLeaveServer);
app.post("/api/TimeSheet/post-history-leave", staffLeaveController.LoadHistoryLeave);
app.post("/api/TimeSheet/post-view-leave", staffLeaveController.ViewLeave);
app.post("/api/TimeSheet/post-submit-view", staffLeaveController.SubmitOnViewLeave);
app.post("/api/TimeSheet/post-load-edit", staffLeaveController.LoadLeaveEdit);
app.post("/api/TimeSheet/post-update-leave", staffLeaveController.UpdateLeave);
app.post("/api/TimeSheet/post-list-leave", staffLeaveController.LoadLeaveApprove);
app.post("/api/TimeSheet/post-check-leave", staffLeaveController.CheckLeave);
//END lEAVE FORM FOR STAFF

//LEAVE FORM FOR MANAGE
app.post("/api/TimeSheet/post-approve-leave", manageLeaveController.ApproveLeave);
app.post("/api/TimeSheet/post-reject-leave", manageLeaveController.RejectLeave);
//END LEAVE FORM FOR MANAGE

//REPORT TIMESHEET-LEAVE FORM
app.post("/api/TimeSheet/post-list-deptRP", reportController.LoadDeptReport);
app.post("/api/TimeSheet/post-list-empRP", reportController.LoadEmpReport);
app.post("/api/TimeSheet/post-list-reports1", reportController.LoadReports1);
app.post("/api/TimeSheet/post-owe-leave", reportController.LoadReportOweLeave);
app.post("/api/TimeSheet/post-utilization-detail", reportController.LoadReportUtilizationRatioDetail);
app.post("/api/TimeSheet/post-utilization-sumary", reportController.LoadReportUtilizationRatioSumary);
app.post("/api/TimeSheet/post-time-inlieu", reportController.LoadReportTimeInLieu);
app.post("/api/TimeSheet/post-item-number", reportController.LoadReportItemNumber);
//END REPORT TIMESHEET-LEAVE FORM
