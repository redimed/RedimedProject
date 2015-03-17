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

        return TimeSheetService;
    });
