angular.module("app.loggedIn.TimeSheet", [])
    .config(function($stateProvider) {

        $stateProvider
        // APPROVE TASK
            .state("loggedIn.timesheetHome.timesheetApprove", {
                position: ["Head of Dept.", "Director"],
                url: "/approve-task",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ApproveTask.html",
                        controller: "ApproveTask"
                    }
                }
            })
            //END APPROVE TASK

        // REPORT TIME IN LIEU
        .state("loggedIn.timesheetHome.timesheetReport1", {
                url: "/report-time-in-lieu",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report1.html",
                        controller: "Report1Controller"
                    }
                }

            })
            //END REPORT TIME IN LIEU

        // REPORT ON UTILIZATION RATIO DETAIL
        .state("loggedIn.timesheetHome.timesheetReport2", {
                url: "/report-on-utilization-ratio-detail",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report2.html",
                        controller: "Report2Controller"
                    }
                }
            })
            //END REPORT

        // REPORT UTILIZATION SUMMARY
        .state("loggedIn.timesheetHome.timesheetReport3", {
                url: "/report-on-utilization-ratio-summary",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report3.html",
                        controller: "Report3Controller"
                    }
                }
            })
            //END REPORT

        // REPORT WORKING HOURS
        .state("loggedIn.timesheetHome.timesheetReport4", {
                url: "/report-on-actual-working-hours",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report4.html",
                        controller: "Report4Controller"
                    }
                }
            })
            //END REPORT 

        // REPORT WORKING RATIO
        .state("loggedIn.timesheetHome.timesheetReport5", {
                url: "/report-on-actual-working-ratio",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report5.html",
                        controller: "Report5Controller"
                    }
                }
            })
            //END REPORT

        // REPORT ITEM NUMBER
        .state("loggedIn.timesheetHome.timesheetReport6", {
                url: "/report-on-item-number",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report6.html",
                        controller: "Report6Controller"
                    }
                }
            })
            //END REPORT

        // CREATE LEAVE
        .state("loggedIn.timesheetHome.leaveCreate", {
                position: ["Staff", "Head of Dept."],
                url: "/create-leave/:id",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/CreateLeave.html",
                        controller: "CreateLeaveController"
                    }
                }
            })
            //END CREATE LEAVE

        // LEAVE HISTORY
        .state("loggedIn.timesheetHome.leaveHistory", {
                position: ["Staff", "Head of Dept."],
                url: "/leave-history",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/HistoryLeave.html",
                        controller: "HistoryLeaveController"
                    }
                }
            })
            //END LEAVE HISTORY

        // APPROVE LEAVE
        .state("loggedIn.timesheetHome.leaveApprove", {
                position: ["Head of Dept.", "Director"],
                url: "/approve-leave",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ApproveLeave.html",
                        controller: "ApproveLeaveController"
                    }
                }
            })
            //END APPROVE LEAVE

        //REPORT SUBMMITED LEAVE FORM
        .state("loggedIn.timesheetHome.leaveReportOwe", {
                position: ["Head of Dept.", "Director"],
                url: "/report-unsubmitted-leave-form",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ReportOweLeave.html",
                        controller: "ReportOweLeave"
                    }
                }
            })
            //END REPORT

        //VIEW TIME-SHEET
        .state("loggedIn.timesheetHome.timesheetHistory", {
                position: ["Staff", "Head of Dept."],
                url: "/view-timesheet",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/viewTimesheet.html",
                        controller: "TimesheetViewController"
                    }
                }
            })
            //END VIEW TIME-SHEET

        //CREATE TIME-SHEET
        .state("loggedIn.timesheetHome.timesheetCreate", {
            position: ["Staff", "Head of Dept."],
            url: "/create/:id",
            views: {
                "main-content": {
                    templateUrl: "modules/TimeSheet/views/createTimesheet.html",
                    controller: "TimesheetCreateController"
                }
            }
        });
        //END CREATE TIME-SHEET
    });
