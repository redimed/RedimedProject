angular.module("app.loggedIn.TimeSheet", [
        "app.loggedIn.TimeSheet.Controllers",
        "app.loggedIn.TimeSheet.Directives",
        "app.loggedIn.TimeSheet.Service"
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state("loggedIn.TimeSheetHome", {
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
            });
    });
