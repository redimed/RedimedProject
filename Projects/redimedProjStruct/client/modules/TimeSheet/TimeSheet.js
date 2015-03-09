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
                url: "/TimeSheetTree",
                templateUrl: "modules/TimeSheet/views/ListTree.html",
                controller: "TimeSheetTree"
            })
            .state("loggedIn.TimeSheetListNode", {
                url: "/TimeSheetListNode",
                templateUrl: "modules/TimeSheet/views/ListNode.html",
                controller: "TimeSheetListNodeController"
            })
            .state("loggedIn.TimeSheetDept", {
                url: "/TimeSheetDept",
                templateUrl: "modules/TimeSheet/views/dept.html",
                controller: "TimeSheetDeptController"
            })
            .state("loggedIn.ApproveTask", {
                url: "/ApproveTask",
                templateUrl: "modules/TimeSheet/views/ApproveTask.html",
                controller: "ApproveTask"
            });
    });
