angular.module("app.loggedIn.TimeSheet", [])
    .factory("TimeSheetService", function(Restangular) {
        var TimeSheetService = {};
        var api = Restangular.all("api");

        TimeSheetService.LoadTaskApproved = function(searchObjPost) {
            var LoadTaskApproved = api.all("TimeSheet/post-list-approved");
            return LoadTaskApproved.post({
                searchObj: searchObjPost
            });
        };

        TimeSheetService.ViewApproved = function(idPost) {
            var ViewApproved = api.all("TimeSheet/post-one-approved");
            return ViewApproved.post({
                info: idPost
            });
        };

        TimeSheetService.LoadTimeSheetApprove = function(searchObjPost) {
            var LoadTimeSheetApprove = api.all("TimeSheet/post-list-approve");
            return LoadTimeSheetApprove.post({
                searchObj: searchObjPost
            });
        };

        TimeSheetService.RejectTaskWeek = function(infoPost) {
            var RejectTaskWeek = api.all("TimeSheet/post-reject-taskweek");
            return RejectTaskWeek.post({
                info: infoPost
            });
        };

        TimeSheetService.ApproveTaskWeek = function(infoPost) {
            var ApproveTaskWeek = api.all("TimeSheet/post-approve-taskweek");
            return ApproveTaskWeek.post({
                info: infoPost
            });
        };
        TimeSheetService.LoadRole = function(idPost) {
            var LoadRole = api.all("TimeSheet/post-role-one");
            return LoadRole.post({
                USER_ID: idPost
            });
        };
        TimeSheetService.ViewItem = function(taskIdPost) {
            var ViewItem = api.all("TimeSheet/post-item-list");
            return ViewItem.post({
                taskID: taskIdPost
            });
        };
        TimeSheetService.ViewOnDate = function(infoPost) {
            var ViewOnDate = api.all("TimeSheet/post-detail-one");
            return ViewOnDate.post({
                info: infoPost
            });
        };

        TimeSheetService.ViewAllDate = function(infoPost) {
            var ViewAllDate = api.all("TimeSheet/post-detail-all");
            return ViewAllDate.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadItemCode = function(searchObjPost) {
            var LoadItemCode = api.all("TimeSheet/post-itemcode-list");
            return LoadItemCode.post({
                searchObj: searchObjPost
            });
        };

        //REPORTS SERVICE
        TimeSheetService.LoadDeptReport = function(idPost) {
            var LoadDeptReport = api.all("TimeSheet/post-list-deptRP");
            return LoadDeptReport.post({
                USER_ID: idPost
            });
        };

        TimeSheetService.LoadEmpReport = function(listDeptPost) {
            var LoadEmpReport = api.all("TimeSheet/post-list-empRP");
            return LoadEmpReport.post({
                listDept: listDeptPost
            });
        };
        TimeSheetService.LoadReportOnActualWorking = function(infoPost) {
            var LoadReportOnActualWorking = api.all("TimeSheet/post-actual-working");
            return LoadReportOnActualWorking.post({
                info: infoPost
            });
        };

        TimeSheetService.sendMailTimeSheet = function(infoPost) {
            var sendMailTimeSheet = api.all('TimeSheet/post-send-mail');
            return sendMailTimeSheet.post({
                info: infoPost
            });
        };
        //END ERPORT SERVICE

        //LEAVE FORM SERVICE
        TimeSheetService.LoadInfoEmployee = function(idPost) {
            var LoadInfoEmployee = api.all("TimeSheet/post-info-employee");
            return LoadInfoEmployee.post({
                USER_ID: idPost
            });
        };

        TimeSheetService.LoadTypeLeave = function() {
            var LoadTypeLeave = api.one("TimeSheet/get-type-leave");
            return LoadTypeLeave.get({});
        };

        TimeSheetService.UpLeaveServer = function(infoPost) {
            var UpLeaveServer = api.all("TimeSheet/post-leave-form");
            return UpLeaveServer.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadHistoryLeave = function(searchObjPost) {
            var LoadHistoryLeave = api.all("TimeSheet/post-history-leave");
            return LoadHistoryLeave.post({
                searchObj: searchObjPost
            });
        };

        TimeSheetService.ViewLeave = function(idLeave) {
            var ViewLeave = api.all("TimeSheet/post-view-leave");
            return ViewLeave.post({
                leave_id: idLeave
            });
        };

        TimeSheetService.SubmitOnViewLeave = function(infoPost) {
            var SubmitOnViewLeave = api.all("TimeSheet/post-submit-view");
            return SubmitOnViewLeave.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadLeaveEdit = function(leaveIDPost) {
            var LoadLeaveEdit = api.all("TimeSheet/post-load-edit");
            return LoadLeaveEdit.post({
                leaveID: leaveIDPost
            });
        };

        TimeSheetService.UpdateLeave = function(infoPost) {
            var UpdateLeave = api.all("TimeSheet/post-update-leave");
            return UpdateLeave.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadLeaveApprove = function(infoPost) {
            var LoadLeaveApprove = api.all("TimeSheet/post-list-leave");
            return LoadLeaveApprove.post({
                info: infoPost
            });
        };

        TimeSheetService.ApproveLeave = function(infoPost) {
            var ApproveLeave = api.all("TimeSheet/post-approve-leave");
            return ApproveLeave.post({
                info: infoPost
            });
        };

        TimeSheetService.RejectLeave = function(infoPost) {
            var RejectLeave = api.all("TimeSheet/post-reject-leave");
            return RejectLeave.post({
                info: infoPost
            });
        };

        TimeSheetService.CheckLeave = function(idPost) {
            var CheckLeave = api.all("TimeSheet/post-check-leave");
            return CheckLeave.post({
                USER_ID: idPost
            });
        };

        TimeSheetService.LoadReportOweLeave = function(infoPost) {
            var LoadReportOweLeave = api.all("TimeSheet/post-owe-leave");
            return LoadReportOweLeave.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadReportTimeInLieu = function(infoPost) {
            var LoadReportTimeInLieu = api.all("TimeSheet/post-time-inlieu");
            return LoadReportTimeInLieu.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadReportItemNumber = function(infoPost) {
            var LoadReportItemNumber = api.all("TimeSheet/post-item-number");
            return LoadReportItemNumber.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadReportUtilizationRatioSumary = function(infoPost) {
            var LoadReportUtilizationRatioSumary = api.all("TimeSheet/post-utilization-sumary");
            return LoadReportUtilizationRatioSumary.post({
                info: infoPost
            });
        };

        TimeSheetService.LoadReportUtilizationRatioDetail = function(infoPost) {
            var LoadReportUtilizationRatioDetail = api.all("TimeSheet/post-utilization-detail");
            return LoadReportUtilizationRatioDetail.post({
                info: infoPost
            });
        };
        //END LEAVE FORM

        TimeSheetService.DeleteFile = function(fileIdPost) {
            var DeleteFile = api.all("TimeSheet/post-del-file");
            return DeleteFile.post({
                fileId: fileIdPost
            });
        };

        return TimeSheetService;
    });
