// EXPORTS MODULE
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
app.get("/api/TimeSheet/get-download-file/:idFile", downloadController.DownloadFile);
//END DOWNLOAD FILE


//TIMESHEET FOR STAFF
app.post('/api/staff/addAllTask', staffTimesheetController.AddAllTask);
app.post('/api/staff/editTask', staffTimesheetController.EditTask);
app.post('/api/staff/getTask', staffTimesheetController.GetTask);
app.post('/api/staff/showDetailDate', staffTimesheetController.ShowDetailDate);
app.post('/api/staff/checkMonth', staffTimesheetController.CheckMonth);
app.post('/api/staff/getAllTaskAMonth', staffTimesheetController.GetAllTaskAMonth);
app.post('/api/staff/checkFirstTaskWeek', staffTimesheetController.CheckFirstTaskWeek);
app.post('/api/staff/checkTaskWeek', staffTimesheetController.CheckTaskWeek);
app.post('/api/staff/showEdit', staffTimesheetController.ShowEdit);
app.get('/api/staff/getDepartmentLocation', staffTimesheetController.GetDepartmentLocationActivity);
app.get('/api/staff/task/getList', staffTimesheetController.GetTaskList);
app.post('/api/staff/items', staffTimesheetController.GetItemList);
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
app.post("/api/TimeSheet/post-actual-working", reportController.LoadReportOnActualWorking);
app.post("/api/TimeSheet/post-owe-leave", reportController.LoadReportOweLeave);
app.post("/api/TimeSheet/post-utilization-detail", reportController.LoadReportUtilizationRatioDetail);
app.post("/api/TimeSheet/post-utilization-sumary", reportController.LoadReportUtilizationRatioSumary);
app.post("/api/TimeSheet/post-time-inlieu", reportController.LoadReportTimeInLieu);
app.post("/api/TimeSheet/post-item-number", reportController.LoadReportItemNumber);
//END REPORT TIMESHEET-LEAVE FORM
