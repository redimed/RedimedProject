angular.module("app.loggedIn.TimeSheet", [
        "app.loggedIn.TimeSheet.Controllers",
        "app.loggedIn.TimeSheet.Directives",
        "app.loggedIn.TimeSheet.Service"
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state("loggedIn.TimeSheetHome", {
                position: ["Admin", "Staff", "Head of Dept.", "Director"],
                url: "/TimeSheetHome",
                templateUrl: "modules/TimeSheet/views/Home.html",
                controller: "TimeSheetHomeController"
            })
            .state("loggedIn.TimeSheetTree", {
                position: ["Admin"],
                url: "/TimeSheetTree",
                templateUrl: "modules/TimeSheet/views/ListTree.html",
                controller: "TimeSheetTree"
            })
            .state("loggedIn.TimeSheetListNode", {
                position: ["Admin"],
                url: "/TimeSheetListNode",
                templateUrl: "modules/TimeSheet/views/ListNode.html",
                controller: "TimeSheetListNodeController"
            })
            .state("loggedIn.TimeSheetDept", {
                position: ["Admin"],
                url: "/TimeSheetDept",
                templateUrl: "modules/TimeSheet/views/dept.html",
                controller: "TimeSheetDeptController"
            })
            .state("loggedIn.ApproveTask", {
                position: ["Head of Dept.", "Director"],
                url: "/ApproveTask",
                templateUrl: "modules/TimeSheet/views/ApproveTask.html",
                controller: "ApproveTask"
            })
            .state("loggedIn.ViewAppovedTimeSheet", {
                position: ["Head of Dept.", "Director"],
                url: "/ViewApprovedTimeSheet",
                templateUrl: "modules/TimeSheet/views/ViewApproved.html",
                controller: "ViewApprovedTimeSheet"
            })
            .state("loggedIn.AdminTimeSheet", {
                position: ['Admin'],
                url: "/AdminTimeSheet",
                templateUrl: "modules/TimeSheet/views/Admin.html",
                controller: "AdminController"
            })
            .state("loggedIn.Report1TimeSheet", {
                url: "/Report1TimeSheet",
                templateUrl: "modules/TimeSheet/views/Report1.html",
                controller: "Report1Controller"
            })
            .state("loggedIn.Report2TimeSheet", {
                url: "/Report2TimeSheet",
                templateUrl: "modules/TimeSheet/views/Report2.html",
                controller: "Report2Controller"
            })
            .state("loggedIn.Report3TimeSheet", {
                url: "/Report3TimeSheet",
                templateUrl: "modules/TimeSheet/views/Report3.html",
                controller: "Report3Controller"
            })
            .state("loggedIn.Report4TimeSheet", {
                url: "/Report4TimeSheet",
                templateUrl: "modules/TimeSheet/views/Report4.html",
                controller: "Report4Controller"
            })
            .state("loggedIn.Report5TimeSheet", {
                url: "/Report5TimeSheet",
                templateUrl: "modules/TimeSheet/views/Report5.html",
                controller: "Report5Controller"
            })
            .state("loggedIn.Report6TimeSheet", {
                url: "/Report6TimeSheet",
                templateUrl: "modules/TimeSheet/views/Report6.html",
                controller: "Report6Controller"
            })
            //MODULE LEAVE FORM
            .state("loggedIn.CreateLeave", {
                position: ["Staff", "Head of Dept."],
                url: "/CreateLeave/:id",
                templateUrl: "modules/TimeSheet/views/CreateLeave.html",
                controller: "CreateLeaveController"
            })
            .state("loggedIn.LeaveHistory", {
                position: ["Staff", "Head of Dept."],
                url: "/LeaveHistory",
                templateUrl: "modules/TimeSheet/views/HistoryLeave.html",
                controller: "HistoryLeaveController"
            })
            .state("loggedIn.ApproveLeave", {
                position: ["Head of Dept.", "Director"],
                url: "/ApproveLeave",
                templateUrl: "modules/TimeSheet/views/ApproveLeave.html",
                controller: "ApproveLeaveController"
            })
            .state("loggedIn.ReportOweLeave", {
                position: ["Head of Dept.", "Director"],
                url: "/ReportOweLeave",
                templateUrl: "modules/TimeSheet/views/ReportOweLeave.html",
                controller: "ReportOweLeave"
            });
        //END LEAVE
    });
