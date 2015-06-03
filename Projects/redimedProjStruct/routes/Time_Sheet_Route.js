// EXPORTS MODULE
var adminController = require("./controllers/TimeSheetController/adminController");
var downloadController = require("./controllers/TimeSheetController/downloadController");
var functionForTimesheet = require("./controllers/TimeSheetController/functionForTimesheet");
var manageLeave = require("./controllers/TimeSheetController/manageLeaveController");
var manageTimesheetController = require("./controllers/TimeSheetController/manageTimesheetController");
var staffLeaveController = require("./controllers/TimeSheetController/staffLeaveController");
var staffTimesheetController = require("./controllers/TimeSheetController/staffTimesheetController");
var sendMailController = require("./controllers/TimeSheetController/sendMailController");
var uploadController = require("./controllers/TimeSheetController/uploadController");
var checkRoleController = require("./controllers/TimeSheetController/checkRoleController");
var reportController=require("./controllers/TimeSheetController/reportController");
var multipartMiddleware = multipart();
//END EXPORTS MODULE

//DEL
var TimeSheet = require("./controllers/TimeSheetController/TimeSheetController");
var TimeSheetUploadController = require("./controllers/TimeSheetController/TimeSheetUploadController");
var TimeSheetController = require('./controllers/TimeSheetController');
//END

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
app.post("/api/TimeSheet/post-upload-file", multipartMiddleware, TimeSheetUploadController.UploadFile);
app.post("/api/TimeSheet/post-del-file", TimeSheet.DeleteFile);
//END UPLOAD FILE TIMESHEET

//DOWNLOAD FILE TIMESHEET
app.get("/api/TimeSheet/get-download-file/:id", TimeSheetUploadController.DownloadFile);
//END DOWNLOAD FILE


//TIMESHEET FOR STAFF
app.post('/api/staff/addAllTask', TimeSheetController.addAllTask);
app.post('/api/staff/editTask', TimeSheetController.editTask);
app.post('/api/staff/getTask', TimeSheetController.getTask);
app.post('/api/staff/showDetailDate', TimeSheetController.showDetailDate);
app.post('/api/staff/checkMonth', TimeSheetController.checkMonth);
app.post('/api/staff/getAllTaskAMonth', TimeSheetController.getAllTaskAMonth);
app.post('/api/staff/checkFirstTaskWeek', TimeSheetController.checkFirstTaskWeek);
app.post('/api/staff/checkTaskWeek', TimeSheetController.checkTaskWeek);
app.post('/api/staff/showEdit', TimeSheetController.showEdit);
app.get('/api/staff/getDepartmentLocation', TimeSheetController.getDepartmentLocation);
app.get('/api/staff/task/getList', TimeSheetController.getTaskList);
app.post('/api/staff/items', TimeSheetController.getItemList);
app.post("/api/staff/get-contract", TimeSheetController.LoadContract);
app.post("/api/staff/SubmitOnView", TimeSheetController.SubmitOnView);
app.post("/api/staff/checktime", TimeSheetController.CheckTimeInLieu);
app.post("/api/TimeSheet/post-itemcode-list", TimeSheet.LoadItemCode);
//END TIMESHEET FOR STAFF

//LEAVE FORM FOR STAFF
app.post("/api/TimeSheet/post-info-employee", TimeSheet.LoadInfoEmployee);
app.post("/api/TimeSheet/post-leave-form", TimeSheet.UpLeaveServer);
app.post("/api/TimeSheet/post-history-leave", TimeSheet.LoadHistoryLeave);
app.post("/api/TimeSheet/post-view-leave", TimeSheet.ViewLeave);
app.post("/api/TimeSheet/post-submit-view", TimeSheet.SubmitOnViewLeave);
app.post("/api/TimeSheet/post-load-edit", TimeSheet.LoadLeaveEdit);
app.post("/api/TimeSheet/post-update-leave", TimeSheet.UpdateLeave);
app.post("/api/TimeSheet/post-list-leave", TimeSheet.LoadLeaveApprove);
app.post("/api/TimeSheet/post-check-leave", TimeSheet.CheckLeave);
//END lEAVE FORM FOR STAFF

//LEAVE FORM FOR MANAGE
app.post("/api/TimeSheet/post-approve-leave", TimeSheet.ApproveLeave);
app.post("/api/TimeSheet/post-reject-leave", TimeSheet.RejectLeave);
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
