angular.module("app.loggedIn.staff.controllers", [
    "app.loggedIn.timesheet.create.controller",
    "app.loggedIn.timesheet.view.controller",
    "app.loggedIn.staff.week.controller",
    "app.loggedIn.staff.month.controller",
    "app.loggedIn.staff.task.controller"
])

    .controller('StaffController',function($scope,$state,toastr){

    });