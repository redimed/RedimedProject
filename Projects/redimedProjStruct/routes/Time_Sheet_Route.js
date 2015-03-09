var TimeSheet = require("./controllers/TimeSheetController/TimeSheetController");
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

//DEPT
app.post("/api/TimeSheet/post-dept-list", TimeSheet.LoadDept);
app.post("/api/TimeSheet/post-dept-del", TimeSheet.DeleteDept);
app.get("/api/TimeSheet/get-location-list", TimeSheet.LoadLocation);
app.post("/api/TimeSheet/post-dept-one", TimeSheet.LoadOneDept);
app.post("/api/TimeSheet/post-dept-insert", TimeSheet.InsertDept);
app.post("/api/TimeSheet/post-dept-update", TimeSheet.UpdateDept);
//END DEPT
