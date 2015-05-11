angular.module("app.loggedIn.TimeSheet.Service", [])
    .factory("TimeSheetService", function(Restangular) {
        var TimeSheetService = {};
        var api = Restangular.all("api");

        TimeSheetService.LoadTreeTimeSheet = function(searchPost) {
            var LoadTreeTimeSheet = api.all("TimeSheet/post-list-tree");
            return LoadTreeTimeSheet.post({
                searchObj: searchPost
            });
        };

        TimeSheetService.LoadNodeTimeSheet = function(searchPost) {
            var LoadNodeTimeSheet = api.all("TimeSheet/post-list-node");
            return LoadNodeTimeSheet.post({
                searchObj: searchPost
            });
        };

        TimeSheetService.LoadUserTimeSheet = function(seachPost) {
            var LoadUserTimeSheet = api.all("TimeSheet/post-list-user");
            return LoadUserTimeSheet.post({
                searchObj: seachPost
            });
        };

        TimeSheetService.LoadSelectUser = function() {
            var LoadSelectUser = api.one("TimeSheet/post-select-user");
            return LoadSelectUser.get({});
        };

        TimeSheetService.DeleteUser = function(userPost) {
            var DeleteUser = api.all("TimeSheet/post-delete-user");
            return DeleteUser.post({
                userPost: userPost
            });
        };

        TimeSheetService.LoadDepartMent = function() {
            var LoadDepartMent = api.one("TimeSheet/get-list-department");
            return LoadDepartMent.get({});
        };

        TimeSheetService.LoadNodeSelect = function(idPost) {
            var LoadNodeSelect = api.all("TimeSheet/post-node-select");
            return LoadNodeSelect.post({
                info: idPost
            });
        };

        TimeSheetService.LoadUser = function(searchObj) {
            var LoadUser = api.all("TimeSheet/post-user-list");
            return LoadUser.post({
                searchObj: searchObj
            });
        };

        TimeSheetService.AddUser = function(info) {
            var AddUser = api.all("TimeSheet/post-user-add");
            return AddUser.post({
                info: info
            });
        };

        TimeSheetService.UpdateUser = function(info) {
            var UpdateUser = api.all("TimeSheet/post-user-update");
            return UpdateUser.post({
                info: info
            });
        };

        TimeSheetService.LoadOneUser = function(info) {
            var LoadOneUser = api.all("TimeSheet/post-user-one");
            return LoadOneUser.post({
                info: info
            });
        };

        TimeSheetService.LoadRoleWhere = function(info) {
            var LoadRoleWhere = api.all("TimeSheet/post-role-where");
            return LoadRoleWhere.post({
                info: info
            });
        };

        TimeSheetService.LoadDeptWhere = function(info) {
            var LoadDeptWhere = api.all("TimeSheet/post-dept-where");
            return LoadDeptWhere.post({
                info: info
            });
        };

        TimeSheetService.LoadDept = function(searchObj) {
            var LoadDept = api.all("TimeSheet/post-dept-list");
            return LoadDept.post({
                searchObj: searchObj
            });
        };

        TimeSheetService.DeleteDept = function(idDept) {
            var DeleteDept = api.all("TimeSheet/post-dept-del");
            return DeleteDept.post({
                idDept: idDept
            });
        };

        TimeSheetService.LoadLocation = function() {
            var LoadLocation = api.one("TimeSheet/get-location-list");
            return LoadLocation.get({});
        };

        TimeSheetService.LoadOneDept = function(idDept) {
            var LoadOneDept = api.all("TimeSheet/post-dept-one");
            return LoadOneDept.post({
                idDept: idDept
            });
        };

        TimeSheetService.InsertDept = function(info) {
            var InsertDept = api.all("TimeSheet/post-dept-insert");
            return InsertDept.post({
                info: info
            });
        };

        TimeSheetService.UpdateDept = function(info) {
            var UpdateDept = api.all("TimeSheet/post-dept-update");
            return UpdateDept.post({
                info: info
            });
        };

        TimeSheetService.LoadTaskApproved = function(searchObj) {
            var LoadTaskApproved = api.all("TimeSheet/post-list-approved");
            return LoadTaskApproved.post({
                searchObj: searchObj
            });
        };

        TimeSheetService.ViewApproved = function(idPost) {
            var ViewApproved = api.all("TimeSheet/post-one-approved");
            return ViewApproved.post({
                info: idPost
            });
        };

        TimeSheetService.LoadTimeSheetApprove = function(searchObj) {
            var LoadTimeSheetApprove = api.all("TimeSheet/post-list-approve");
            return LoadTimeSheetApprove.post({
                searchObj: searchObj
            });
        };

        TimeSheetService.RejectTaskWeek = function(info) {
            var RejectTaskWeek = api.all("TimeSheet/post-reject-taskweek");
            return RejectTaskWeek.post({
                info: info
            });
        };

        TimeSheetService.ApproveTaskWeek = function(info) {
            var ApproveTaskWeek = api.all("TimeSheet/post-approve-taskweek");
            return ApproveTaskWeek.post({
                info: info
            });
        };
        TimeSheetService.LoadRole = function(USER_ID) {
            var LoadRole = api.all("TimeSheet/post-role-one");
            return LoadRole.post({
                USER_ID: USER_ID
            });
        };
        TimeSheetService.ViewItem = function(taskID) {
            var ViewItem = api.all("TimeSheet/post-item-list");
            return ViewItem.post({
                taskID: taskID
            });
        };
        TimeSheetService.ViewOnDate = function(info) {
            var ViewOnDate = api.all("TimeSheet/post-detail-one");
            return ViewOnDate.post({
                info: info
            });
        };

        TimeSheetService.ViewAllDate = function(info) {
            var ViewAllDate = api.all("TimeSheet/post-detail-all");
            return ViewAllDate.post({
                info: info
            });
        };

        TimeSheetService.LoadItemCode = function(searchObj) {
            var LoadItemCode = api.all("TimeSheet/post-itemcode-list");
            return LoadItemCode.post({
                searchObj: searchObj
            });
        };
        TimeSheetService.StepEmployee = function(info) {
            var StepEmployee = api.all("TimeSheet/post-list-emp");
            return StepEmployee.post({
                info: info
            });
        };

        //REPORTS SERVICE
        TimeSheetService.LoadDeptReport = function(USER_ID) {
            var LoadDeptReport = api.all("TimeSheet/post-list-deptRP");
            return LoadDeptReport.post({
                USER_ID: USER_ID
            });
        };

        TimeSheetService.LoadEmpReport = function(listDept) {
            var LoadEmpReport = api.all("TimeSheet/post-list-empRP");
            return LoadEmpReport.post({
                listDept: listDept
            });
        };
        TimeSheetService.LoadReports1 = function(info) {
            var LoadReports1 = api.all("TimeSheet/post-list-reports1");
            return LoadReports1.post({
                info: info
            });
        };

        TimeSheetService.sendMailTimeSheet = function(info) {
            var sendMailTimeSheet = api.all('TimeSheet/post-send-mail');
            return sendMailTimeSheet.post({
                info: info
            });
        };
        //END ERPORT SERVICE

        //LEAVE FORM SERVICE
        TimeSheetService.LoadInfoEmployee = function(USER_ID) {
            var LoadInfoEmployee = api.all("TimeSheet/post-info-employee");
            return LoadInfoEmployee.post({
                USER_ID: USER_ID
            });
        };

        TimeSheetService.LoadTypeLeave = function() {
            var LoadTypeLeave = api.one("TimeSheet/get-type-leave");
            return LoadTypeLeave.get({});
        };

        TimeSheetService.UpLeaveServer = function(info) {
            var UpLeaveServer = api.all("TimeSheet/post-leave-form");
            return UpLeaveServer.post({
                info: info
            });
        };

        TimeSheetService.LoadHistoryLeave = function(searchObj) {
            var LoadHistoryLeave = api.all("TimeSheet/post-history-leave");
            return LoadHistoryLeave.post({
                searchObj: searchObj
            });
        };

        TimeSheetService.ViewLeave = function(idLeave) {
            var ViewLeave = api.all("TimeSheet/post-view-leave");
            return ViewLeave.post({
                leave_id: idLeave
            });
        };

        TimeSheetService.SubmitOnViewLeave = function(info) {
            var SubmitOnViewLeave = api.all("TimeSheet/post-submit-view");
            return SubmitOnViewLeave.post({
                info: info
            });
        };

        TimeSheetService.LoadLeaveEdit = function(leaveID) {
            var LoadLeaveEdit = api.all("TimeSheet/post-load-edit");
            return LoadLeaveEdit.post({
                leaveID: leaveID
            });
        };

        TimeSheetService.UpdateLeave = function(info) {
            var UpdateLeave = api.all("TimeSheet/post-update-leave");
            return UpdateLeave.post({
                info: info
            });
        };

        TimeSheetService.LoadLeaveApprove = function(info) {
            var LoadLeaveApprove = api.all("TimeSheet/post-list-leave");
            return LoadLeaveApprove.post({
                info: info
            });
        };

        TimeSheetService.ApproveLeave = function(info) {
            var ApproveLeave = api.all("TimeSheet/post-approve-leave");
            return ApproveLeave.post({
                info: info
            });
        };

        TimeSheetService.RejectLeave = function(info) {
            var RejectLeave = api.all("TimeSheet/post-reject-leave");
            return RejectLeave.post({
                info: info
            });
        };

        TimeSheetService.CheckLeave = function(USER_ID) {
            var CheckLeave = api.all("TimeSheet/post-check-leave");
            return CheckLeave.post({
                USER_ID: USER_ID
            });
        };
        //END LEAVE FORM

        return TimeSheetService;
    });
