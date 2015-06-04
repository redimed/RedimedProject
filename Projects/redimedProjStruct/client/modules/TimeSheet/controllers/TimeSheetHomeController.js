angular.module("app.loggedIn.TimeSheet.Home.Controller", [
        "app.loggedIn.TimeSheet.Home.Controller", //TIME SHEET HOME PAGE
        "app.loggedIn.TimeSheet.ApproveTask.Controller", //APPROVE TIME SHEET
        "app.loggedIn.TimeSheet.Report1.Controller", //REPORT ON TIME IN LIEU
        "app.loggedIn.TimeSheet.Report2.Controller", //REPORT ON UTILIZATION RATIO - VIEW BY DETAIL ACTIVITIES
        "app.loggedIn.TimeSheet.Report3.Controller", //REPORT ON UTILIZATION RATIO - VIEW BY SUMARY ACTIVITIES
        "app.loggedIn.TimeSheet.Report4.Controller", //REPORT ON ACTUAL WORKING HOURS
        "app.loggedIn.TimeSheet.Report5.Controller", //REPORT ON ACTUAL WORKING RATIO
        "app.loggedIn.TimeSheet.Report6.Controller", //REPORT ON ITEM NUMBERS
        "app.loggedIn.TimeSheet.ReportOweLeave.Controller", //REPORT OWE LEAVE
        "app.loggedIn.TimeSheet.CreateLeave.Controller", //CREATE LEAVE
        "app.loggedIn.TimeSheet.HistoryLeave.Controller", //HISTORY LEAVE
        "app.loggedIn.TimeSheet.ApproveLeave.Controller", //APPROVE LEAVE
        "angularFileUpload", //UPLOAD  FILE
        "app.loggedIn.timesheet.create.controller", //CREATE TIMESHEET
        "app.loggedIn.timesheet.view.controller", //VIEW TIMESHEET
        "app.loggedIn.staff.week.controller", //WEEK
        "app.loggedIn.staff.month.controller", //MONTH
        "app.loggedIn.staff.task.controller" //TASK
    ])
    .controller("TimeSheetHomeController", function($scope) {});
