angular.module("app.loggedIn.staff", [
    "app.loggedIn.staff.controllers",
    "app.loggedIn.staff.directives",
    "app.loggedIn.staff.service"
])

    .config(function ($stateProvider) {

        $stateProvider

            // STRUCTURE
            .state("loggedIn.staff", {
                abstract: true,
                url: "/staff",
                templateUrl: "modules/staff/views/structure.html",
                controller: "StaffController"
            })
            //END STRUCTURE

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

    })
