var TimeSheet = require("./controllers/TimeSheetController/TimeSheetController");

//MANAGE USER -DEPT
app.post("/api/TimeSheet/post-list-tree", TimeSheet.LoadTreeTimeSheet);
app.post("/api/TimeSheet/post-list-node", TimeSheet.LoadNodeTimeSheet);
app.post("/api/TimeSheet/post-list-user", TimeSheet.LoadUserTimeSheet);
app.get("/api/TimeSheet/post-select-user", TimeSheet.LoadSelectUser);
app.post("/api/TimeSheet/post-delete-user", TimeSheet.DeleteUser);
app.get("/api/TimeSheet/get-list-department", TimeSheet.LoadDepartMent);
app.post("/api/TimeSheet/post-node-select", TimeSheet.LoadNodeSelect);
app.post("/api/TimeSheet/post-user-list", TimeSheet.LoadUser);
app.post("/api/TimeSheet/post-user-add", TimeSheet.AddUser);
app.post("/api/TimeSheet/post-user-one", TimeSheet.LoadOneUser);
app.post("/api/TimeSheet/post-user-update", TimeSheet.UpdateUser);
app.post("/api/TimeSheet/post-role-where", TimeSheet.LoadRoleWhere);
app.post("/api/TimeSheet/post-dept-where", TimeSheet.LoadDeptWhere);
//END MANAGE USER - DEPT

//DEPT
app.post("/api/TimeSheet/post-dept-list", TimeSheet.LoadDept);
app.post("/api/TimeSheet/post-dept-del", TimeSheet.DeleteDept);
app.get("/api/TimeSheet/get-location-list", TimeSheet.LoadLocation);
app.post("/api/TimeSheet/post-dept-one", TimeSheet.LoadOneDept);
app.post("/api/TimeSheet/post-dept-insert", TimeSheet.InsertDept);
app.post("/api/TimeSheet/post-dept-update", TimeSheet.UpdateDept);
//END DEPT

//VIEW APPROVED TIMESHEETS
app.post("/api/TimeSheet/post-one-approved", TimeSheet.ViewApproved);
//END VIEW APPROVED TIMESHEETS

//APPROVE TIMESHEET
app.post("/api/TimeSheet/post-list-approve", TimeSheet.LoadTimeSheetApprove);
app.post("/api/TimeSheet/post-reject-taskweek", TimeSheet.RejectTaskWeek);
app.post("/api/TimeSheet/post-approve-taskweek", TimeSheet.ApproveTaskWeek);
//END APPROVE TIMSHEET

//VIEW DETAIL TIMESHEET
app.post("/api/TimeSheet/post-detail-one", TimeSheet.ViewOnDate);
//END VIEW DETAIL TIMESHEET

//ROLE
app.post("/api/TimeSheet/post-role-one", TimeSheet.LoadRole);
//END ROLE

//ITEM CODE
app.post("/api/TimeSheet/post-itemcode-list", TimeSheet.LoadItemCode);
//END ITEM CODE

//EMPLOYEE
app.post("/api/TimeSheet/post-list-emp", TimeSheet.StepEmployee);
//END

// REPORT
app.post("/api/TimeSheet/post-list-deptRP", TimeSheet.LoadDeptReport);
app.post("/api/TimeSheet/post-list-empRP", TimeSheet.LoadEmpReport);
app.post("/api/TimeSheet/post-list-reports1", TimeSheet.LoadReports1);
app.post("/api/TimeSheet/post-owe-leave", TimeSheet.LoadReportOweLeave);
app.post("/api/TimeSheet/post-utilization-detail", TimeSheet.LoadReportUtilizationRatioDetail);
app.post("/api/TimeSheet/post-utilization-sumary", TimeSheet.LoadReportUtilizationRatioSumary);
app.post("/api/TimeSheet/post-time-inlieu", TimeSheet.LoadReportTimeInLieu);
app.post("/api/TimeSheet/post-item-number", TimeSheet.LoadReportItemNumber);
//END REPORT

//SEND MAIL
// END SEND MAIL

// LEAVE FORM
app.post("/api/TimeSheet/post-info-employee", TimeSheet.LoadInfoEmployee);
app.get("/api/TimeSheet/get-type-leave", TimeSheet.LoadTypeLeave);
app.post("/api/TimeSheet/post-leave-form", TimeSheet.UpLeaveServer);
app.post("/api/TimeSheet/post-history-leave", TimeSheet.LoadHistoryLeave);
app.post("/api/TimeSheet/post-view-leave", TimeSheet.ViewLeave);
app.post("/api/TimeSheet/post-submit-view", TimeSheet.SubmitOnViewLeave);
app.post("/api/TimeSheet/post-load-edit", TimeSheet.LoadLeaveEdit);
app.post("/api/TimeSheet/post-update-leave", TimeSheet.UpdateLeave);
app.post("/api/TimeSheet/post-list-leave", TimeSheet.LoadLeaveApprove);
app.post("/api/TimeSheet/post-approve-leave", TimeSheet.ApproveLeave);
app.post("/api/TimeSheet/post-reject-leave", TimeSheet.RejectLeave);
app.post("/api/TimeSheet/post-check-leave", TimeSheet.CheckLeave);
//END lEAVE
