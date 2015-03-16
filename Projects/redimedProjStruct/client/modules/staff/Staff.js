angular.module("app.loggedIn.staff", [
    "app.loggedIn.staff.controllers",
    "app.loggedIn.staff.directives",
    "app.loggedIn.staff.service"
])

.config(function($stateProvider) {

    $stateProvider

    //STRUCTURE
        .state("loggedIn.timesheet", {
            abstract: true,
            url: "/timesheet",
            templateUrl: "modules/staff/views/structure.html",
            controller: "StaffController"
        })
        //END STRUCTURE

    //VIEW TIME-SHEET
    .state("loggedIn.timesheet.view", {
            position: ["Staff", "Head of Dept."],
            url: "/view",
            views: {
                "main-content": {
                    templateUrl: "modules/staff/views/viewTimesheet.html",
                    controller: "TimesheetViewController"
                }
            }
        })
        //END VIEW TIME-SHEET

    //CREATE TIME-SHEET
    .state("loggedIn.timesheet.create", {
        position: ["Staff", "Head of Dept."],
        url: "/create",
        views: {
            "main-content": {
                templateUrl: "modules/staff/views/createTimesheet.html",
                controller: "TimesheetCreateController"
            }
        }
    });
    //END CREATE TIME-SHEET
});
