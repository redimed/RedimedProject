angular.module("app.loggedIn.staff", [
    "app.loggedIn.staff.controllers",
    "app.loggedIn.staff.directives",
    "app.loggedIn.staff.service"
])

    .config(function ($stateProvider) {

        $stateProvider

            // STRUCTURE
            .state("loggedIn.timesheet", {
                abstract: true,
                url: "/timesheet",
                templateUrl: "modules/staff/views/structure.html",
                controller: "StaffController"
            })
            //END STRUCTURE

            //VIEW TIME-SHEET
            .state("loggedIn.timesheet.view", {
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
                url: "/create",
                views: {
                    "main-content": {
                        templateUrl: "modules/staff/views/createTimesheet.html",
                        controller: "TimesheetCreateController"
                    }
                }
            })
            //END CREATE TIME-SHEET

            //DASHBOARD HOME
            .state("loggedIn.staff.list", {
                url: "/calendar",
                views: {
                    "main-content": {
                        templateUrl: "modules/staff/views/calendar.html",
                        controller: "StaffCalendarController"
                    }
                }
            })
            //END DASHBOARD HOME

            //Manage Task
            .state("loggedIn.staff.manage", {
                url: "/manageTask",
                views: {
                    "main-content": {
                        templateUrl: "modules/staff/views/manageTask.html",
                        controller:"ManageTaskController"
                    }
                }
            })
            //END Manage Task

            //View Task
            .state("loggedIn.staff.view", {
                url: "/viewTask",
                views: {
                    "main-content": {
                        templateUrl: "modules/staff/views/viewTask.html",
                        controller:"ViewTaskController"
                    }
                }
            })
        //END View Task

    })
